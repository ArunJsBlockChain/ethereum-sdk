import { Get, Post } from "./service"

interface ITokenData {
  userAddress:string
  collectionAddress:string
}

export interface IBalance{
  weth_address?:string
  owner:string
  networkId:string
}

export const generateNftTokenId = async (tokenData:ITokenData) => {
  return  await Post({
      url:'tokenId/generateTokenId',
      payload: tokenData
  })
}

export const getNftCollectionById = async (collectionId:string) => {
  return  await Post({
      url:`collections/getCollectionById`,
      payload:{id:collectionId}
  })
}

export const getNftItemById = async (itemId:string) => {
  return  await Post({
      url:`nft/getItemShortDetailsById`,
      payload:{id:itemId}
  })
}

export const upsertOrder = async (orders:any) => {
  return await Post({
    url:`orders/createOrder`,
    payload:orders
  })
}

export const getOrderByHash = async (orderHash:string) => {
  return await Post({
      url:`order/getOrderByHash`,
      payload:{hash:orderHash}
  })
}

export const getNftOwnershipById = async (ownerShipId:string) => {
  return await Post({
      url:`items/getNftOwnershipId`,
      payload:{ownershipId:ownerShipId}
  })
}

export const getEthBalance = async (data:IBalance) => {
  return  await Post({
      url:`balance/${data.owner}`,
      payload:data
  })
}

export const getWEthBalance = async (data:IBalance) => {
  return  await Post({
      url:`balance/${data.weth_address}/${data.owner}`,
      payload:data
  })
}

export const getFeeJson = async () => {
  return  await Get({url:`fees/getFeeJSON`})
}