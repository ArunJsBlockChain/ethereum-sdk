import type { AssetType, NftItemControllerApi } from "@rarible/ethereum-api-client"
import { getNftItemById, getNftLazyItemById } from "../zodeak-api-client"

export async function checkLazyAssetType(itemApi: NftItemControllerApi, type: AssetType): Promise<AssetType> {
	switch (type.assetClass) {
		case "ERC1155":
		case "ERC721": {
			const itemResponse = await getNftItemById(`${type.contract}:${type.tokenId}`)
			if (itemResponse.status === 200 && itemResponse.data.lazySupply === "0") {
				return type
			}
			const lazyItemResponse = await getNftLazyItemById({ itemId: `${type.contract}:${type.tokenId}` })
			const lazyResponse = lazyItemResponse.data

			if (lazyItemResponse.status === 200) {
				const lazy = lazyResponse
				switch (lazy["@type"]) {
					case "ERC721": {
						return {
							...lazy,
							assetClass: "ERC721_LAZY",
						}
					}
					case "ERC1155": {
						return {
							...lazy,
							assetClass: "ERC1155_LAZY",
						}
					}
					default: return type
				}
			}
			return type
		}
		default: return type
	}
}
