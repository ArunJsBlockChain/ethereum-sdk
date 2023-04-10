import { toAddress, ZERO_ADDRESS } from "@rarible/types"
import { id32 } from "../common/id"
import type { EthereumConfig } from "./type"
import { FEE_CONFIG_URL } from "./common"

export const binanceConfig: EthereumConfig = {
	basePath: "https://testnet-ethereum-api.rarible.org",
	chainId: 56,
	exchange: {
		v1: ZERO_ADDRESS,
		v2: toAddress("0x408CA22df1Ed41239583EEeF5CDC32383224aFdB"),//Our Contract
		openseaV1: ZERO_ADDRESS,
		wrapper: ZERO_ADDRESS,
		looksrare: ZERO_ADDRESS,
		x2y2: ZERO_ADDRESS,
	},
	transferProxies: {
		nft: toAddress("0xE595d84b8581DC1Da1f78aa78ED5c69B6E546f3d"),//Our Contract
		erc20: toAddress("0x25bBF12113D35213E06C066099b04C03A8A7eb15"),//Our Contract
		erc721Lazy: toAddress("0x74Dec098cD72F9EAF26c484d717063C9343fD3c4"),//Our Contract
		erc1155Lazy: toAddress("0x0942273619809Ce00BEEb8F8eBe83db854e58248"),//Our Contract
		openseaV1: ZERO_ADDRESS,
		cryptoPunks: ZERO_ADDRESS,
	},
	feeConfigUrl: FEE_CONFIG_URL,
	openSea: {
		metadata: id32("RARIBLE"),
		proxyRegistry: ZERO_ADDRESS,
		merkleValidator: ZERO_ADDRESS,
	},
	factories: {
		erc721: toAddress("0xd1aA4eBaAaec2BD014Ae1DD5A3dcDca2D0b8e223"),//Our Contract
		erc1155: toAddress("0x6265AF1c9fc6e074e11Db1371bf8E699f5354900"),//Our Contract
	},
	cryptoPunks: {
		marketContract: ZERO_ADDRESS,
		wrapperContract: ZERO_ADDRESS,
	},
	sudoswap: {
		pairFactory: ZERO_ADDRESS,
		pairRouter: ZERO_ADDRESS,
	},
	weth: toAddress("0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"),//Our Contract
	auction: ZERO_ADDRESS,
}
