import { toAddress } from "@rarible/types"
import { toBn } from "@rarible/utils/build/bn"
import type { Address, Asset, Part } from "@rarible/ethereum-api-client"
import type { Ethereum } from "@rarible/ethereum-provider"
import type { RaribleSdk } from "../../../../../index"
import { delay, retry } from "../../../../../common/retry"
import { createErc721V3Collection } from "../../../../../common/mint"
import { MintResponseTypeEnum } from "../../../../../nft/mint"
import type { FillBatchSingleOrderRequest } from "../../../types"
import type { SimpleAmmOrder, SimpleOrder } from "../../../../types"
import { ItemType } from "../../../seaport-utils/constants"
import { getOpenseaEthTakeData } from "../../../../test/get-opensea-take-data"
import { createSeaportOrder } from "../../../../test/order-opensea"
import type { SendFunction } from "../../../../../common/send-transaction"
import { makeRaribleSellOrder } from "../../../looksrare-utils/create-order"
import type { EthereumConfig } from "../../../../../config/type"
import { mintTokensToNewSudoswapPool } from "../../../amm/test/utils"

const rinkebyErc721V3ContractAddress = toAddress("0x6ede7f3c26975aad32a475e1021d8f6f39c89d82")
// const rinkebyErc1155V2ContractAddress = toAddress("0x1af7a7555263f275433c6bb0b8fdcd231f89b1d7")

export async function mintTestToken(sdk: RaribleSdk) {
	const sellItem = await sdk.nft.mint({
		collection: createErc721V3Collection(rinkebyErc721V3ContractAddress),
		uri: "ipfs://ipfs/QmfVqzkQcKR1vCNqcZkeVVy94684hyLki7QcVzd9rmjuG5",
		royalties: [],
		lazy: false,
	})
	if (sellItem.type === MintResponseTypeEnum.ON_CHAIN) {
		await sellItem.transaction.wait()
	}

	return sellItem
}

export async function makeRaribleV2Order(
	sdk: RaribleSdk,
	request: {
		price?: string,
	},
) {
	const token = await mintTestToken(sdk)
	//token
	const sellOrder = await sdk.order.sell({
		type: "DATA_V2",
		amount: 1,
		priceDecimal: toBn(request.price ?? "0.000000000001"),
		takeAssetType: {
			assetClass: "ETH",
		},
		payouts: [],
		originFees: [],
		makeAssetType: {
			assetClass: "ERC721",
			contract: token.contract,
			tokenId: token.tokenId,
		},
	})

	return await waitUntilOrderActive(sdk, sellOrder.hash)
}

export async function makeSeaportOrder(
	sdk: RaribleSdk,
	ethereum: Ethereum,
	send: SendFunction,
) {
	const token = await mintTestToken(sdk)
	await delay(10000)
	const orderHash = await retry(10, 1000, async () => {
		const make = {
			itemType: ItemType.ERC721,
			token: token.contract,
			identifier: token.tokenId,
		} as const
		const take = getOpenseaEthTakeData("10000000000")
		return await createSeaportOrder(ethereum, send, make, take)
	})
	return await waitUntilOrderActive(sdk, orderHash)
}

export async function makeLooksrareOrder(
	sdk: RaribleSdk,
	ethereum: Ethereum,
	send: SendFunction,
	config: EthereumConfig
) {
	const token = await mintTestToken(sdk)

	const sellOrder = await makeRaribleSellOrder(
		ethereum,
		{
			assetClass: "ERC721",
			contract: token.contract,
			tokenId: token.tokenId,
		},
		send,
		toAddress(config.exchange.looksrare!)
	)

	return sellOrder
}

export async function makeAmmOrder(
	sdk: RaribleSdk,
	ethereum: Ethereum,
	send: SendFunction,
	config: EthereumConfig
): Promise<SimpleAmmOrder> {
	const {poolAddress} = await mintTokensToNewSudoswapPool(sdk, ethereum, send, config.sudoswap.pairFactory, 1)
	const orderHash = "0x" + poolAddress.slice(2).padStart(64, "0")
	return await retry(20, 2000, async () => {
		return await sdk.apis.order.getOrderByHash({hash: orderHash})
	}) as SimpleAmmOrder
}

export function ordersToRequests(
	orders: SimpleOrder[],
	originFees?: Part[],
	payouts?: Part[],
): FillBatchSingleOrderRequest[] {
	return orders.map((order) => {
		if (
			order.type !== "RARIBLE_V2" &&
			order.type !== "OPEN_SEA_V1" &&
			order.type !== "SEAPORT_V1" &&
			order.type !== "LOOKSRARE" &&
			order.type !== "AMM"
		) {
			throw new Error("Unsupported order type")
		}

		return {
			order,
			amount: order.make.value,
			originFees,
			payouts,
		} as FillBatchSingleOrderRequest
	})
}

export function waitUntilOrderActive(sdk: RaribleSdk, orderHash: string) {
	return retry(30, 2000, async () => {
		const order = await sdk.apis.order.getOrderByHash({ hash: orderHash })
		expect(order.status).toBe("ACTIVE")
		return order
	})
}

export async function checkOwnerships(sdk: RaribleSdk, assets: Asset[], expectedOwner: Address) {
	await Promise.all(assets.map(async (asset) => {
		await retry(20, 2000, async () => {
			if (
				asset.assetType.assetClass === "ETH" ||
				asset.assetType.assetClass === "ERC20" ||
				asset.assetType.assetClass === "COLLECTION" ||
				asset.assetType.assetClass === "GEN_ART" ||
				asset.assetType.assetClass === "AMM_NFT"
			) {
				throw new Error("Not an token type")
			}

			const ownership = await sdk.apis.nftOwnership.getNftOwnershipsByItem({
				contract: asset.assetType.contract,
				tokenId: asset.assetType.tokenId.toString(),
			})

			expect(ownership.ownerships[0].owner).toEqual(expectedOwner)
		})
	}))
}
