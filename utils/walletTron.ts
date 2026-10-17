import { secp256k1 } from '@noble/curves/secp256k1'
import { keccak_256 } from '@noble/hashes/sha3'
import { sha256 } from '@noble/hashes/sha2'
import { HDKey } from '@scure/bip32'
import { createBase58check } from '@scure/base'
import { mnemonicToSeedSync } from '@scure/bip39'
import { decodeAbiParameters } from 'viem'
import { assertDeriveCount, assertMnemonic } from '@/utils/wallet'

const base58check = createBase58check(sha256)

export interface ITronNetwork {
  id: string
  name: string
  symbol: string
  decimals: number
  isTestnet?: boolean
  apiBase: string
  explorerBase: string
}

export const TRON_NETWORKS: ITronNetwork[] = [
  {
    id: 'mainnet',
    name: 'Tron',
    symbol: 'TRX',
    decimals: 6,
    apiBase: 'https://api.trongrid.io',
    explorerBase: 'https://tronscan.org/#/address',
  },
  {
    id: 'nile',
    name: 'Tron Nile',
    symbol: 'TRX',
    decimals: 6,
    isTestnet: true,
    apiBase: 'https://nile.trongrid.io',
    explorerBase: 'https://nile.tronscan.org/#/address',
  },
  {
    id: 'shasta',
    name: 'Tron Shasta',
    symbol: 'TRX',
    decimals: 6,
    isTestnet: true,
    apiBase: 'https://api.shasta.trongrid.io',
    explorerBase: 'https://shasta.tronscan.org/#/address',
  },
]

export function getTronNetwork(networkId: string): ITronNetwork {
  const network = TRON_NETWORKS.find((item) => item.id === networkId)
  if (!network) throw new Error('未知 Tron 网络')
  return network
}

export function deriveTronWallets(mnemonic: string, count: number) {
  const phrase = assertMnemonic(mnemonic)
  assertDeriveCount(count)
  const root = HDKey.fromMasterSeed(mnemonicToSeedSync(phrase))

  return Array.from({ length: count }, (_, index) => {
    const path = `m/44'/195'/0'/0/${index}`
    const child = root.derive(path)
    if (!child.privateKey) throw new Error(`派生第 ${index + 1} 个地址的私钥失败`)
    return {
      index,
      path,
      address: tronAddressFromPrivateKey(child.privateKey),
      privateKey: bytesToHex(child.privateKey),
    }
  })
}

export function tronAddressFromPrivateKey(privateKey: Uint8Array): string {
  const uncompressed = secp256k1.getPublicKey(privateKey, false)
  const hash = keccak_256(uncompressed.slice(1))
  const payload = new Uint8Array(21)
  payload[0] = 0x41
  payload.set(hash.slice(-20), 1)
  return base58check.encode(payload)
}

export function isTronAddress(value: string): boolean {
  try {
    const decoded = base58check.decode(value.trim())
    return decoded.length === 21 && decoded[0] === 0x41
  } catch {
    return false
  }
}

export async function getTronBalance(networkId: string, address: string): Promise<bigint> {
  const network = getTronNetwork(networkId)
  const response = await fetch(`${network.apiBase}/v1/accounts/${address}`, {
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) throw new Error('查询失败')
  const data = await response.json()
  const balance = data?.data?.[0]?.balance
  return BigInt(balance ?? 0)
}

export async function readTronToken(networkId: string, contractAddress: string) {
  const address = contractAddress.trim()
  if (!isTronAddress(address)) throw new Error('请输入有效的 TRC20 合约地址')
  const [symbol, decimals] = await Promise.all([
    callTrc20<string>(networkId, address, 'symbol()', '', [{ type: 'string' }]),
    callTrc20<number>(networkId, address, 'decimals()', '', [{ type: 'uint8' }]),
  ])
  const normalized = String(symbol || '').trim()
  if (!normalized) throw new Error('读取代币信息失败')
  return {
    id: address,
    address,
    symbol: normalized,
    decimals: Number(decimals),
  }
}

export async function getTronTokenBalance(networkId: string, owner: string, contractAddress: string): Promise<bigint> {
  const parameter = tronAddressToParameter(owner)
  const value = await callTrc20<bigint>(
    networkId,
    contractAddress,
    'balanceOf(address)',
    parameter,
    [{ type: 'uint256' }],
    owner
  )
  return value
}

export function getTronExplorerUrl(networkId: string, address: string): string {
  return `${getTronNetwork(networkId).explorerBase}/${address}`
}

async function callTrc20<T>(
  networkId: string,
  contractAddress: string,
  selector: string,
  parameter: string,
  outputs: { type: string }[],
  ownerAddress = contractAddress
): Promise<T> {
  const network = getTronNetwork(networkId)
  const response = await fetch(`${network.apiBase}/wallet/triggerconstantcontract`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      owner_address: ownerAddress,
      contract_address: contractAddress,
      function_selector: selector,
      parameter,
      visible: true,
    }),
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) throw new Error('读取代币信息失败')
  const data = await response.json()
  const hexResult = data?.constant_result?.[0]
  if (!hexResult) throw new Error(data?.result?.message || '读取代币信息失败')
  const decoded = decodeAbiParameters(outputs, `0x${hexResult}`)
  return decoded[0] as T
}

function tronAddressToParameter(address: string): string {
  const decoded = base58check.decode(address)
  return bytesToHex(decoded.slice(1)).padStart(64, '0')
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}
