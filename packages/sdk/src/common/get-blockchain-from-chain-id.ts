export function getBlockchainFromChainId(chainId: number): EVMBlockchain {
	switch (chainId) {
		case 1:
		case 5:
		case 3:
		case 17:
		case 300500:
			return "ETHEREUM"
		case 137:
		case 80001:
		case 300501:
			return "POLYGON"
		case 56:
		case 97:
			return "BINANCE"
		default: throw new Error("ChainID from config could not be recognized")
	}
}

export type EVMBlockchain = "ETHEREUM" | "POLYGON" | "BINANCE"
