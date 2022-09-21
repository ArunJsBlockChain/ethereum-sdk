import type { Address, NftCollectionControllerApi, NftTokenId } from "@rarible/ethereum-api-client"
import { generateNftTokenId } from "../zodeak-api-client"

export async function getTokenId(
	nftCollectionApi: NftCollectionControllerApi, collection: Address, minter: Address, nftTokenId?: NftTokenId
) {
	if (nftTokenId !== undefined) {
		return nftTokenId
	}
	return await nftCollectionApi.generateNftTokenId({ collection, minter })
}

export async function ZodeakGetTokenId(
	nftCollectionApi: NftCollectionControllerApi, collection: Address, minter: Address, nftTokenId?: NftTokenId
) {
	if (nftTokenId !== undefined) {
		return nftTokenId
	}
	const response = await generateNftTokenId({collectionAddress:collection, userAddress:minter})
	return {tokenId:response.data.tokenId}
}
