import { toBigNumber } from "@rarible/types"
import type {
	Address, CollectionAssetType,
	CryptoPunksAssetType,
	Erc1155AssetType,
	Erc721AssetType,
	NftCollectionControllerApi,
} from "@rarible/ethereum-api-client"
import type { Erc721LazyAssetType } from "@rarible/ethereum-api-client/build/models/AssetType"
import type { Erc1155LazyAssetType } from "@rarible/ethereum-api-client/build/models/AssetType"
import { getNftCollectionById } from "../zodeak-api-client"

export type NftAssetType = {
	contract: Address
	tokenId: string | number
}

export type AssetTypeRequest =
  Erc721AssetType | Erc721LazyAssetType | Erc1155AssetType | Erc1155LazyAssetType
  | NftAssetType | CryptoPunksAssetType | CollectionAssetType

export type AssetTypeResponse =
  Erc721AssetType | Erc721LazyAssetType | Erc1155AssetType | Erc1155LazyAssetType
  | CryptoPunksAssetType | CollectionAssetType

export type CheckAssetTypeFunction = (asset: AssetTypeRequest) => Promise<AssetTypeResponse>

export async function checkAssetType(
	collectionApi: NftCollectionControllerApi, asset: AssetTypeRequest
): Promise<AssetTypeResponse> {
	if ("assetClass" in asset) {
		return asset
	} else {
		const collectionResponse = await getNftCollectionById(asset.contract)
		if (collectionResponse.status === 200) {
			switch (collectionResponse.data[0].type) {
				case "ERC721":
				case "ERC1155": {
					return {
						...asset,
						tokenId: toBigNumber(`${asset.tokenId}`),
						assetClass: collectionResponse.data[0].type,
					}
				}
				case "CRYPTO_PUNKS": {
					return {
						assetClass: "CRYPTO_PUNKS",
						contract: asset.contract,
						tokenId: parseInt(`${asset.tokenId}`),
					}
				}
				default: {
					throw new Error(`Unrecognized collection asset class ${collectionResponse.data[0].type}`)
				}
			}
		} else {
			throw new Error(`Can't get info of NFT collection with id ${asset.contract}`)
		}
	}
}
