import { toAddress, ZERO_ADDRESS } from "@rarible/types"
import { id32 } from "../common/id"
import type { EthereumConfig } from "./type"
import { FEE_CONFIG_URL } from "./common"

export const testnetEthereumConfig: EthereumConfig = {
	basePath: "https://testnet-ethereum-api.rarible.org",
	chainId: 5,
	exchange: {
		v1: toAddress("0xda381535565b97640a6453fa7a1a7b161af78cbe"),
		v2: toAddress("0xd3E69156b8D315303d01380883598a784777bAdb"),//Our Contract
		openseaV1: toAddress("0xdd54d660178b28f6033a953b0e55073cfa7e3744"),
		wrapper: toAddress("0x3D830cB13043912af930587a471D6C9b32Aa42E9"),
		looksrare: toAddress("0x1AA777972073Ff66DCFDeD85749bDD555C0665dA"),
		x2y2: ZERO_ADDRESS,
	},
	transferProxies: {
		nft: toAddress("0x2c39F9F1334c7f539BBe7bcA94e2c15792D3b50B"),//Our Contract
		erc20: toAddress("0x0753749A61b63F9FD6FB9B0810688C5e8C8C60A5"),//Our Contract
		erc721Lazy: toAddress("0x1c171B2906E9cFA0BC19489D3694158dD06a875A"),//Our Contract
		erc1155Lazy: toAddress("0x80bCd886Be9c434F9402Ab99777690D8a83972A1"),//Our Contract
		openseaV1: toAddress("0xcdc9188485316bf6fa416d02b4f680227c50b89e"),
		cryptoPunks: toAddress("0xfc2aa1b3365b8e0cac7a7d22fd7655e643792d17"),
	},
	feeConfigUrl: FEE_CONFIG_URL,
	openSea: {
		metadata: id32("RARIBLE"),
		proxyRegistry: toAddress("0x1e525eeaf261ca41b809884cbde9dd9e1619573a"),
		merkleValidator: toAddress("0x45b594792a5cdc008d0de1c1d69faa3d16b3ddc1"),
	},
	factories: {
		erc721: toAddress("0x2475CC0a44AaF9524668eF94083Cea61A3F1B4E3"),//Our Contract
		erc1155: toAddress("0x797D747cd3ED887Eb4AF56Abd812016124DEe199"),//Our Contract
	},
	cryptoPunks: {
		marketContract: toAddress("0x85252f525456d3fce3654e56f6eaf034075e231c"),
		wrapperContract: toAddress("0x7898972f9708358acb7ea7d000ebdf28fcdf325c"),
	},
	sudoswap: {
		pairFactory: toAddress("0xcB1514FE29db064fa595628E0BFFD10cdf998F33"),
		pairRouter: toAddress("0x9ABDe410D7BA62fA11EF37984c0Faf2782FE39B5"),
	},
	weth: toAddress("0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"),//Our Contract
	auction: ZERO_ADDRESS,
}
