import type { ContractSendMethod, SendOptions } from "web3-eth-contract"
import type { PromiEvent, TransactionReceipt } from "web3-core"
import { toAddress, toBinary, toWord } from "@rarible/types"
import type { GatewayControllerApi } from "@rarible/ethereum-api-client"
import type { EthereumFunctionCall, EthereumSendOptions, EthereumTransaction } from "@rarible/ethereum-provider"
import { LogsLevel } from "../types"
import type { ILoggerConfig } from "./logger/logger"
import { getErrorMessageString } from "./logger/logger"

export type SendFunction = (
	functionCall: EthereumFunctionCall, options?: EthereumSendOptions,
) => Promise<EthereumTransaction>

type SendMethod = (
	api: GatewayControllerApi,
	checkChainId: () => Promise<boolean>,
	functionCall: EthereumFunctionCall,
	options?: EthereumSendOptions
) => Promise<EthereumTransaction>

export function getSendWithInjects(injects: {
	logger?: ILoggerConfig
} = {}): SendMethod {
	const logger = injects.logger

	return async function send(
		api: GatewayControllerApi,
		checkChainId: () => Promise<boolean>,
		functionCall: EthereumFunctionCall,
		options?: EthereumSendOptions
	): Promise<EthereumTransaction> {
		await checkChainId()
		const callInfo = await functionCall.getCallInfo()
		const logsAvailable = logger && logger.level && callInfo

		try {
			const tx = await functionCall.send(options)
			try {
			  await createPendingLogs(api, tx)
			} catch (e) {
				console.error("createPendingLogs error", e)
			}
			try {
				if (logsAvailable && logger.level >= LogsLevel.TRACE) {
					logger.instance.raw({
						level: "TRACE",
						method: callInfo.method,
						message: {
							from: callInfo.from,
							args: callInfo.args,
							tx,
						},
					})
				}
			} catch (e) {
				console.error("Error while sending logs", e)
			}
			return tx
		} catch (err: any) {
			try {
				if (logsAvailable && logger.level >= LogsLevel.ERROR && callInfo) {
					let data = undefined
					try {
						data = await functionCall.getData()
					} catch (e: any) {
						console.error("Unable to get tx data for log", e)
					}

					logger.instance.raw({
						level: "ERROR",
						method: callInfo.method,
						message: {
							error: getErrorMessageString(err),
							from: callInfo.from,
							args: callInfo.args,
						},
						data,
					})
				}
			} catch (e) {
				console.error("Error while sending logs", e, err)
			}
			throw err
		}
	}
}

type SimpleSendMethod = (
	checkChainId: () => Promise<boolean>,
	functionCall: EthereumFunctionCall,
	options?: EthereumSendOptions,
) => Promise<EthereumTransaction>

export function getSimpleSendWithInjects(injects: {
	logger?: ILoggerConfig
} = {}): SimpleSendMethod {
	const logger = injects.logger

	return async function simpleSend(
		checkChainId: () => Promise<boolean>,
		functionCall: EthereumFunctionCall,
		options?: EthereumSendOptions,
	) {
		const callInfo = await functionCall.getCallInfo()
		const logsAvailable = logger && logger.level && callInfo

		try {
			const tx = functionCall.send(options)
			try {
				if (logsAvailable && logger.level >= LogsLevel.TRACE) {
					logger.instance.trace(callInfo.method, {
						from: callInfo.from,
						args: callInfo.args,
						tx,
					})
				}
			} catch (e) {
				console.error("Error while sending logs", e)
			}
			return tx
		} catch (err: any) {
			try {
				if (logsAvailable && logger.level >= LogsLevel.ERROR && callInfo) {
					logger.instance.error(callInfo.method, {
						from: callInfo.from,
						args: callInfo.args,
						error: getErrorMessageString(err),
					})
				}
			} catch (e) {
				console.error("Error while sending logs", e, err)
			}
			throw err
		}
	}
}

export async function createPendingLogs(api: GatewayControllerApi, tx: EthereumTransaction) {
	const createTransactionRequest = {
		hash: toWord(tx.hash),
		from: toAddress(tx.from),
		to: tx.to ? toAddress(tx.to) : undefined,
		input: toBinary(tx.data),
		nonce: tx.nonce,
	}
	return []
}

export async function sentTx(source: ContractSendMethod, options: SendOptions): Promise<string> {
	const event = source.send({ ...options, gas: 3000000 })
	return waitForHash(event)
}

export async function sentTxConfirm(source: ContractSendMethod, options: SendOptions): Promise<string> {
	const event = source.send({ ...options, gas: 3000000 })
	return waitForConfirmation(event)
}

export async function waitForHash<T>(promiEvent: PromiEvent<T>): Promise<string> {
	return new Promise((resolve, reject) => {
		promiEvent.once("transactionHash", hash => resolve(hash))
		promiEvent.once("error", error => reject(error))
	})
}

export async function waitForConfirmation<T>(promiEvent: PromiEvent<T>): Promise<string> {
	return new Promise((resolve, reject) => {
		promiEvent.once("confirmation", (confNumber: number, receipt: TransactionReceipt) => resolve(receipt.transactionHash))
		promiEvent.once("error", error => reject(error))
	})
}
export async function waitForReceipt<T>(promiEvent: PromiEvent<T>): Promise<TransactionReceipt> {
	return new Promise((resolve, reject) => {
		promiEvent.once("receipt", receipt => resolve(receipt))
		promiEvent.once("error", error => reject(error))
	})
}
