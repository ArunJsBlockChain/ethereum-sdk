import { Get, Post } from "./service"

interface ITokenData {
  userAddress:string
  collectionAddress:string
}

export const generateNftTokenId = async (tokenData:ITokenData) => {
  return  await Post({
      url:'tokenId/generateTokenId',
      payload: tokenData
  })
}

export const getNftCollectionById = async (tokenType:"ERC-721"| "ERC-1155") => {
    return  await Get({
        url:`getCollections/${tokenType}`
    })
}