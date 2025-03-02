import type { Binary, ConfigurationParameters } from "@rarible/ethereum-api-client"
import type { Word } from "@rarible/types"

export type EthereumNetwork =
  | "testnet"
  | "mainnet"
  | "mumbai"
  | "polygon"
  | "dev-ethereum"
  | "dev-polygon"
  | "bscTestnet"
  | "binance"

export enum LogsLevel {
	DISABLED = 0,
	ERROR = 1,
	TRACE = 2
}

export interface IRaribleEthereumSdkConfig {
	apiClientParams?: ConfigurationParameters
	logs?: LogsLevel
	ethereum?: EthereumNetworkConfig
	polygon?: EthereumNetworkConfig
	fillCalldata?: Binary
}

export interface EthereumNetworkConfig {
	openseaOrdersMetadata?: Word
}
