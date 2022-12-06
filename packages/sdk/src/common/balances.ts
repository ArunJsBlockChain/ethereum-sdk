import type { Address } from "@rarible/types"
import type {
	Erc20AssetType,
	EthAssetType,
} from "@rarible/ethereum-api-client/build/models/AssetType"
import type { BigNumberValue } from "@rarible/utils"
import { toBn } from "@rarible/utils"
import type { RaribleEthereumApis } from "./apis"
import { getEthBalance, getWEthBalance } from "../zodeak-api-client"

export type BalanceRequestAssetType = EthAssetType | Erc20AssetType

export class Balances {
	constructor(private readonly apis: RaribleEthereumApis) {
		this.getBalance = this.getBalance.bind(this)
	}

	async getBalance(address: Address, assetType: BalanceRequestAssetType): Promise<BigNumberValue> {
		switch (assetType.assetClass) {
			case "ETH": {
				const ethBalanceResponse = await getEthBalance({
					owner: address, 
					networkId:"5"
				})
				const ethBalance = ethBalanceResponse.data
				return toBn(ethBalance.decimalBalance)
			}
			case "ERC20": {
				const balanceResponse = await getWEthBalance({
					owner: address, 
					networkId:"5", 
					weth_address: assetType.contract
				})
				const balance = balanceResponse.data
				return toBn(balance.decimalBalance)
			}
			default: throw new Error("Asset class is not supported")
		}
	}
}
