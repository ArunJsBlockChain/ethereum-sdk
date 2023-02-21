import { toAddress, ZERO_ADDRESS } from "@rarible/types"
import { id32 } from "../common/id"
import type { EthereumConfig } from "./type"
import { FEE_CONFIG_URL } from "./common"

export const mumbaiConfig: EthereumConfig = {
	basePath: "https://testnet-polygon-api.rarible.org",
	chainId: 80001,
	exchange: {
		v1: ZERO_ADDRESS,
		v2: toAddress("0x89660767725685A53ebF9B827A91666465044964"),//Our Contract
		openseaV1: ZERO_ADDRESS,
		wrapper: ZERO_ADDRESS,
		x2y2: ZERO_ADDRESS,
	},
	transferProxies: {
		nft: toAddress("0x408CA22df1Ed41239583EEeF5CDC32383224aFdB"),//Our Contract
		erc20: toAddress("0x81d06535205484cb32A0ab18B3c5415768cA2554"),//Our Contract
		erc721Lazy: toAddress("0x4eE52442a3A3a8B06D59C53cE3C82948A209863A"),//Our Contract
		erc1155Lazy: toAddress("0xbF576dB6DD8eAf08F2cCe03d20d520c489f23988"),//Our Contract
		openseaV1: ZERO_ADDRESS,
		cryptoPunks: ZERO_ADDRESS,
	},
	feeConfigUrl: FEE_CONFIG_URL,
	openSea: {
		metadata: id32("RARIBLE"),
		proxyRegistry: ZERO_ADDRESS,
	},
	factories: {
		erc721: toAddress("0x22147191A6a5707ff7bcBe261ba5923d36Ac44F4"),//Our Contract
		erc1155: toAddress("0xae814ab42B63C2f7c83993F22D1cdAFA2DD4265e"),//Our Contract
	},
	cryptoPunks: {
		marketContract: ZERO_ADDRESS,
		wrapperContract: ZERO_ADDRESS,
	},
	sudoswap: {
		pairFactory: ZERO_ADDRESS,
		pairRouter: ZERO_ADDRESS,
	},
	weth: toAddress("0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa"),
	auction: ZERO_ADDRESS,
}
