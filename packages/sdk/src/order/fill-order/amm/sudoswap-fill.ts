import type { BigNumber } from "@rarible/types"
import { toBigNumber, ZERO_ADDRESS } from "@rarible/types"
import type { Ethereum } from "@rarible/ethereum-provider"
import type { AmmOrderFillRequest, OrderFillSendData } from "../types"
import type { EthereumConfig } from "../../../config/type"
import { createSudoswapRouterV1Contract } from "../../contracts/sudoswap-router-v1"
import { getUpdatedCalldata } from "../common/get-updated-call"
import type { IRaribleEthereumSdkConfig } from "../../../types"


export class SudoswapFill {
	static async getDirectFillData(
		ethereum: Ethereum,
		request: AmmOrderFillRequest,
		config: EthereumConfig,
		sdkConfig?: IRaribleEthereumSdkConfig
	): Promise<OrderFillSendData> {
		const order = this.getOrder(request)

		let fillData: OrderFillSendData
		switch (order.make.assetType.assetClass) {
			case "ERC721":
				fillData = await this.buySpecificNFTs(ethereum, request, config, [order.make.assetType.tokenId])
				break
			case "AMM_NFT":
				if (request.assetType?.tokenId) {
					fillData = await this.buySpecificNFTs(ethereum, request, config, [
						toBigNumber(request.assetType.tokenId.toString()),
					])
				} else {
					fillData = await this.buyAnyNFTs(ethereum, request, config, 1)
				}
				break
			default:
				throw new Error("Unsupported asset type " + order.take.assetType.assetClass)
		}

		return {
			functionCall: fillData.functionCall,
			options: {
				...fillData.options,
				additionalData: getUpdatedCalldata(sdkConfig),
			},
		}
	}

	static getDeadline(duration: number = 4 * 60 * 60 /* 4 hours */ ): BigNumber {
		const deadlineTimestamp = ~~(Date.now() / 1000) + duration
		return toBigNumber("0x" + deadlineTimestamp.toString(16).padStart(64, "0"))
	}

	private static getRouterContract(ethereum: Ethereum, config: EthereumConfig) {
		const { pairRouter } = config.sudoswap
		if (!pairRouter || pairRouter === ZERO_ADDRESS) {
			throw new Error("Sudoswap router contract address has not been set. Change address in config")
		}
		return createSudoswapRouterV1Contract(ethereum, pairRouter)
	}

	private static getOrder(request: AmmOrderFillRequest) {
		const order = request.order
		if (order.data.dataType !== "SUDOSWAP_AMM_DATA_V1") {
			throw new Error("Wrong order data type " + order.data.dataType)
		}
		if (order.take.assetType.assetClass !== "ETH") {
			throw new Error("Sudoswap supports swaps only for ETH")
		}
		return order
	}

	private static async getNftRecipient(ethereum: Ethereum) {
		return await ethereum.getFrom()
	}

	private static async getETHRecipient(ethereum: Ethereum) {
		return await ethereum.getFrom()
	}

	private static async buySpecificNFTs(
		ethereum: Ethereum,
		request: AmmOrderFillRequest,
		config: EthereumConfig,
		tokenIds: BigNumber[]
	): Promise<OrderFillSendData> {
		const routerContract = this.getRouterContract(ethereum, config)
		const order = this.getOrder(request)
		return {
			functionCall: routerContract.functionCall(
				"swapETHForSpecificNFTs",
				[{
					pair: order.data.poolAddress,
					nftIds: tokenIds,
				}],
				await this.getETHRecipient(ethereum),
				await this.getNftRecipient(ethereum),
				SudoswapFill.getDeadline()
			),
			options: {
				value: order.take.value,
			},
		}
	}

	private static async buyAnyNFTs(
		ethereum: Ethereum,
		request: AmmOrderFillRequest,
		config: EthereumConfig,
		amount: number
	): Promise<OrderFillSendData> {
		const routerContract = this.getRouterContract(ethereum, config)
		const order = this.getOrder(request)
		return {
			functionCall: routerContract.functionCall(
				"swapETHForAnyNFTs",
				[{
					pair: order.data.poolAddress,
					numItems: amount,
				}],
				await this.getETHRecipient(ethereum),
				await this.getNftRecipient(ethereum),
				SudoswapFill.getDeadline()
			),
			options: {
				value: order.take.value,
			},
		}
	}
}
