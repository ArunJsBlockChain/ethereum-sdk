import type { AxiosResponse } from "axios"
import axios from "axios"
import { handleAxiosErrorResponse } from "@rarible/logger/build"
import type { EthereumConfig } from "../config/type"
import type { EthereumNetwork } from "../types"
import type { SimpleOrder } from "../order/types"
import { CURRENT_ORDER_TYPE_VERSION } from "./order"
import { NetworkErrorCode } from "./logger/logger"
import { getFeeJson } from "../zodeak-api-client"

export async function getBaseFee(
	config: EthereumConfig,
	env: EthereumNetwork,
	type: SimpleOrder["type"] | "AUCTION" = CURRENT_ORDER_TYPE_VERSION
): Promise<number> {
	let envFeeConfig
	try {
	  const commonFeeConfigResponse: AxiosResponse<CommonFeeConfig> = await getFeeJson()
		envFeeConfig = commonFeeConfigResponse.data[env]

		if (!envFeeConfig) {
			throw new Error(`Fee config was not found for ${env}`)
		}
	} catch (e) {
		console.error(e)
		handleAxiosErrorResponse(e, { code: NetworkErrorCode.ETHEREUM_EXTERNAL_ERR })
		throw e
	}

	if (!(type in envFeeConfig)) {
		throw new Error(`Unsupported fee type ${type}`)
	}

	return Number(envFeeConfig[type] || 0)
}

export type CommonFeeConfig = Record<EthereumNetwork, EnvFeeConfig>
export type EnvFeeConfig = Record<SimpleOrder["type"] | "AUCTION", number>
