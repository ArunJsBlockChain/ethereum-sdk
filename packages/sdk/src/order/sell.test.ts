import { toAddress, toBigNumber, toBinary } from "@rarible/types"
import type { OrderForm } from "@rarible/ethereum-api-client"
import {
	Configuration,
	GatewayControllerApi,
	NftCollectionControllerApi,
	NftLazyMintControllerApi,
	OrderControllerApi,
} from "@rarible/ethereum-api-client"
import { createE2eProvider, createE2eWallet } from "@rarible/ethereum-sdk-test-common"
import { toBn } from "@rarible/utils"
import { getEthereumConfig } from "../config"
import { getApiConfig } from "../config/api-config"
import type { ERC721RequestV3 } from "../nft/mint"
import { mint as mintTemplate } from "../nft/mint"
import { createTestProviders } from "../common/create-test-providers"
import { getSendWithInjects } from "../common/send-transaction"
import { signNft as signNftTemplate } from "../nft/sign-nft"
import { createErc721V3Collection } from "../common/mint"
import { delay, retry } from "../common/retry"
import { createEthereumApis } from "../common/apis"
import { getEstimateGasInjects } from "../common/estimate-gas"
import { OrderSell } from "./sell"
import { signOrder as signOrderTemplate } from "./sign-order"
import { OrderFiller } from "./fill-order"
import { UpsertOrder } from "./upsert-order"
import { checkAssetType as checkAssetTypeTemplate } from "./check-asset-type"
import { TEST_ORDER_TEMPLATE } from "./test/order"
import { checkChainId } from "./check-chain-id"

const providerConfig = {
	networkId: 4,
	rpcUrl: "https://node-rinkeby.rarible.com",
}
const { provider, wallet } = createE2eProvider(
	"0x00120de4b1518cf1f16dc1b02f6b4a8ac29e870174cb1d8575f578480930250a",
	providerConfig
)
const { providers } = createTestProviders(provider, wallet)

// describe.each(providers)("sell", (ethereum) => {
describe.skip("sell", () => {
	//todo remove and uncomment describe.each
	const ethereum = providers[0]
	const env = "testnet" as const
	const configuration = new Configuration(getApiConfig(env))
	const nftCollectionApi = new NftCollectionControllerApi(configuration)
	const gatewayApi = new GatewayControllerApi(configuration)
	const nftLazyMintApi = new NftLazyMintControllerApi(configuration)
	const orderApi = new OrderControllerApi(configuration)
	const config = getEthereumConfig(env)
	const signOrder = signOrderTemplate.bind(null, ethereum, config)
	const checkAssetType = checkAssetTypeTemplate.bind(null, nftCollectionApi)
	const signNft = signNftTemplate.bind(null, ethereum, config.chainId)
	const checkWalletChainId = checkChainId.bind(null, ethereum, config)
	const send = getSendWithInjects().bind(null, gatewayApi, checkWalletChainId)
	const estimateGas = getEstimateGasInjects()
	const mint = mintTemplate
		.bind(null, ethereum, send, signNft, nftCollectionApi)
		.bind(null, nftLazyMintApi, checkWalletChainId)
	const apis = createEthereumApis("testnet")

	const getBaseOrderFee = async () => 0
	const orderService = new OrderFiller(ethereum, send, estimateGas, config, apis, getBaseOrderFee, env)
	const upserter = new UpsertOrder(
		orderService,
		send,
		(x) => Promise.resolve(x),
		() => Promise.resolve(undefined),
		signOrder,
		orderApi,
		ethereum,
		checkWalletChainId
	)
	const orderSell = new OrderSell(upserter, checkAssetType, checkWalletChainId)
	const e2eErc721V3ContractAddress = toAddress("0x6ede7f3c26975aad32a475e1021d8f6f39c89d82")
	const treasury = createE2eWallet()
	const treasuryAddress = toAddress(treasury.getAddressString())

	test("create and update of v2 works", async () => {
		const makerAddress = toAddress(wallet.getAddressString())
		const minted = await mint({
			collection: createErc721V3Collection(e2eErc721V3ContractAddress),
			uri: "ipfs://ipfs/hash",
			creators: [{
				account: makerAddress,
				value: 10000,
			}],
			royalties: [],
			lazy: false,
		} as ERC721RequestV3)

		const order = await orderSell.sell({
			type: "DATA_V2",
			maker: toAddress(wallet.getAddressString()),
			makeAssetType: {
				assetClass: "ERC721",
				contract: minted.contract,
				tokenId: minted.tokenId,
			},
			price: toBn("2"),
			takeAssetType: {
				assetClass: "ETH",
			},
			amount: 1,
			payouts: [],
			originFees: [{
				account: treasuryAddress,
				value: 100,
			}],
			start: Math.round(Date.now()/1000 + 10),
			end: Math.round(Date.now()/1000 + 200),
		})

		expect(order.status).toBe("INACTIVE")
		expect(order.hash).toBeTruthy()

		await delay(1000)

		const nextPrice = toBigNumber("1")

		await retry(5, 500, async () => {
			const updatedOrder = await orderSell.update({
				orderHash: order.hash,
				price: nextPrice,
			})
			expect(updatedOrder.take.value.toString()).toBe(nextPrice.toString())
		})
	})

	test("create and update of v1 works", async () => {
		const makerAddress = toAddress(wallet.getAddressString())
		const minted = await mint({
			collection: createErc721V3Collection(e2eErc721V3ContractAddress),
			uri: "ipfs://ipfs/hash",
			creators: [{
				account: makerAddress,
				value: 10000,
			}],
			royalties: [],
			lazy: false,
		} as ERC721RequestV3)

		const form: OrderForm = {
			...TEST_ORDER_TEMPLATE,
			maker: makerAddress,
			make: {
				assetType: {
					assetClass: "ERC721",
					contract: minted.contract,
					tokenId: minted.tokenId,
				},
				value: toBigNumber("1"),
			},
			take: {
				assetType: {
					assetClass: "ETH",
				},
				value: toBigNumber("2"),
			},
			salt: toBigNumber("10"),
			type: "RARIBLE_V1",
			data: {
				dataType: "LEGACY",
				fee: 250,
			},
			signature: toBinary("0x"),
		}
		const order = await upserter.upsert({ order: form })

		await delay(1000)

		const nextPrice = toBigNumber("1")

		await retry(5, 500, async () => {
			const updatedOrder = await orderSell.update({
				orderHash: order.hash,
				price: nextPrice,
			})
			expect(updatedOrder.take.value.toString()).toBe(nextPrice.toString())
		})
	})
})
