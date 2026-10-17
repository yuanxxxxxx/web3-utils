import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import { NETWORK, TEST_NETWORK, WIF, p2pkh, p2sh, p2tr, p2wpkh } from '@scure/btc-signer'
import { assertDeriveCount, assertMnemonic } from '@/utils/wallet'

export type BtcAddressFormat = 'native' | 'taproot' | 'nested' | 'legacy'

export interface IBtcNetwork {
  id: string
  name: string
  symbol: string
  decimals: number
  isTestnet?: boolean
  apiBases: string[]
  explorerBase: string
  coinType: 0 | 1
  network: typeof NETWORK
}

export interface IBtcFormat {
  id: BtcAddressFormat
  name: string
  purpose: 44 | 49 | 84 | 86
}

export const BTC_FORMATS: IBtcFormat[] = [
  { id: 'native', name: 'Native SegWit', purpose: 84 },
  { id: 'taproot', name: 'Taproot', purpose: 86 },
  { id: 'nested', name: 'Nested SegWit', purpose: 49 },
  { id: 'legacy', name: 'Legacy', purpose: 44 },
]

export const BTC_NETWORKS: IBtcNetwork[] = [
  {
    id: 'mainnet',
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    apiBases: ['https://blockstream.info/api', 'https://mempool.space/api'],
    explorerBase: 'https://blockstream.info/address',
    coinType: 0,
    network: NETWORK,
  },
  {
    id: 'testnet',
    name: 'Bitcoin Testnet',
    symbol: 'tBTC',
    decimals: 8,
    isTestnet: true,
    apiBases: ['https://blockstream.info/testnet/api', 'https://mempool.space/testnet/api'],
    explorerBase: 'https://blockstream.info/testnet/address',
    coinType: 1,
    network: TEST_NETWORK,
  },
  {
    id: 'signet',
    name: 'Bitcoin Signet',
    symbol: 'sBTC',
    decimals: 8,
    isTestnet: true,
    apiBases: ['https://blockstream.info/signet/api', 'https://mempool.space/signet/api'],
    explorerBase: 'https://blockstream.info/signet/address',
    coinType: 1,
    network: TEST_NETWORK,
  },
]

export function getBtcNetwork(networkId: string): IBtcNetwork {
  const network = BTC_NETWORKS.find((item) => item.id === networkId)
  if (!network) throw new Error('未知比特币网络')
  return network
}

export function getBtcFormat(formatId?: string): IBtcFormat {
  return BTC_FORMATS.find((item) => item.id === formatId) ?? BTC_FORMATS[0]
}

export function getBtcPath(format: IBtcFormat, coinType: number, index: number): string {
  return `m/${format.purpose}'/${coinType}'/0'/0/${index}`
}

export function deriveBtcWallets(mnemonic: string, count: number, networkId: string, formatId?: string) {
  const phrase = assertMnemonic(mnemonic)
  assertDeriveCount(count)
  const network = getBtcNetwork(networkId)
  const format = getBtcFormat(formatId)
  const root = HDKey.fromMasterSeed(mnemonicToSeedSync(phrase))

  return Array.from({ length: count }, (_, index) => {
    const path = getBtcPath(format, network.coinType, index)
    const child = root.derive(path)
    if (!child.privateKey || !child.publicKey) {
      throw new Error(`派生第 ${index + 1} 个地址的私钥失败`)
    }
    return {
      index,
      path,
      address: btcAddress(child.publicKey, format.id, network.network),
      privateKey: WIF(network.network).encode(child.privateKey),
    }
  })
}

function btcAddress(publicKey: Uint8Array, format: BtcAddressFormat, network: typeof NETWORK): string {
  if (format === 'legacy') return requireAddress(p2pkh(publicKey, network).address)
  if (format === 'nested') return requireAddress(p2sh(p2wpkh(publicKey), network).address)
  if (format === 'taproot') return requireAddress(p2tr(publicKey.slice(1), undefined, network).address)
  return requireAddress(p2wpkh(publicKey, network).address)
}

function requireAddress(address?: string): string {
  if (!address) throw new Error('生成比特币地址失败')
  return address
}

export async function getBtcBalance(networkId: string, address: string): Promise<bigint> {
  const network = getBtcNetwork(networkId)
  let lastError: unknown
  for (const apiBase of network.apiBases) {
    try {
      const response = await fetch(`${apiBase}/address/${address}`, {
        signal: AbortSignal.timeout(12_000),
      })
      if (!response.ok) throw new Error('查询失败')
      const data = await response.json()
      const funded = BigInt(data?.chain_stats?.funded_txo_sum ?? 0)
      const spent = BigInt(data?.chain_stats?.spent_txo_sum ?? 0)
      return funded > spent ? funded - spent : BigInt(0)
    } catch (error) {
      lastError = error
    }
  }
  throw lastError instanceof Error ? lastError : new Error('查询失败')
}

export function getBtcExplorerUrl(networkId: string, address: string): string {
  return `${getBtcNetwork(networkId).explorerBase}/${address}`
}
