import { toAddress, ZERO_ADDRESS } from "@rarible/types"
import { id32 } from "../common/id"
import type { EthereumConfig } from "./type"
import { FEE_CONFIG_URL } from "./common"

export const testnetEthereumConfig: EthereumConfig = {
	basePath: "https://testnet-ethereum-api.rarible.org",
	chainId: 4,
	exchange: {
		v1: toAddress("0xda381535565b97640a6453fa7a1a7b161af78cbe"),
		v2: toAddress("0x4c3b3F91Fab7db15634E766fD5c3f91dfFf012A1"),//Our Contract
		openseaV1: toAddress("0xdd54d660178b28f6033a953b0e55073cfa7e3744"),
		wrapper: toAddress("0x3D830cB13043912af930587a471D6C9b32Aa42E9"),
		looksrare: toAddress("0x1AA777972073Ff66DCFDeD85749bDD555C0665dA"),
		x2y2: ZERO_ADDRESS,
	},
	transferProxies: {
		nft: toAddress("0xE673C16a64C7464b057768f9A970851e262228af"),//Our Contract
		erc20: toAddress("0x6371E28b3325EFaC77AEDF36485134C2802956Cc"),//Our Contract
		erc721Lazy: toAddress("0x956c88034900240dF14f8DbF05c68075960C0434"),//Our Contract
		erc1155Lazy: toAddress("0x517539bCBAE3daB6d7293A1b2DA264912255790B"),//Our Contract
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
		erc721: toAddress("0x4e24860A2792CD8d7E867666fdcdbD81E36FfCD2"),//Our Contract
		erc1155: toAddress("0x1fb7cA0c909fEaB39893dD60F8Bac1Ea48A62Ab2"),//Our Contract
	},
	cryptoPunks: {
		marketContract: toAddress("0x85252f525456d3fce3654e56f6eaf034075e231c"),
		wrapperContract: toAddress("0x7898972f9708358acb7ea7d000ebdf28fcdf325c"),
	},
	sudoswap: {
		pairFactory: toAddress("0xcB1514FE29db064fa595628E0BFFD10cdf998F33"),
		pairRouter: toAddress("0x9ABDe410D7BA62fA11EF37984c0Faf2782FE39B5"),
	},
	weth: toAddress("0xc778417e063141139fce010982780140aa0cd5ab"),
	auction: ZERO_ADDRESS,
}
