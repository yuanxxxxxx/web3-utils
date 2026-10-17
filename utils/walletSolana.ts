import { ed25519 } from '@noble/curves/ed25519'
import { hmac } from '@noble/hashes/hmac'
import { sha256, sha512 } from '@noble/hashes/sha2'
import { base58 } from '@scure/base'
import { mnemonicToSeedSync } from '@scure/bip39'
import { assertDeriveCount, assertMnemonic } from '@/utils/wallet'

const HARDENED = 0x80000000
const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
const TOKEN_2022_PROGRAM_ID = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
const ASSOCIATED_TOKEN_PROGRAM_ID = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
const METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
const PDA_MARKER = new TextEncoder().encode('ProgramDerivedAddress')

export interface ISolanaNetwork {
  id: string
  name: string
  symbol: string
  decimals: number
  isTestnet?: boolean
  rpcUrl: string
  cluster?: 'devnet' | 'testnet'
}

export const SOLANA_NETWORKS: ISolanaNetwork[] = [
  {
    id: 'mainnet',
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    rpcUrl: 'https://solana-rpc.publicnode.com',
  },
  {
    id: 'devnet',
    name: 'Solana Devnet',
    symbol: 'SOL',
    decimals: 9,
    isTestnet: true,
    rpcUrl: 'https://api.devnet.solana.com',
    cluster: 'devnet',
  },
  {
    id: 'testnet',
    name: 'Solana Testnet',
    symbol: 'SOL',
    decimals: 9,
    isTestnet: true,
    rpcUrl: 'https://api.testnet.solana.com',
    cluster: 'testnet',
  },
]

export function getSolanaNetwork(networkId: string): ISolanaNetwork {
  const network = SOLANA_NETWORKS.find((item) => item.id === networkId)
  if (!network) throw new Error('未知 Solana 网络')
  return network
}

export function deriveSolanaWallets(mnemonic: string, count: number) {
  const phrase = assertMnemonic(mnemonic)
  assertDeriveCount(count)
  const seed = mnemonicToSeedSync(phrase)

  return Array.from({ length: count }, (_, index) => {
    const path = `m/44'/501'/${index}'/0'`
    const secret = slip10Ed25519(seed, [44 + HARDENED, 501 + HARDENED, index + HARDENED, HARDENED])
    const publicKey = ed25519.getPublicKey(secret)
    return {
      index,
      path,
      address: base58.encode(publicKey),
      privateKey: base58.encode(concat([secret, publicKey])),
    }
  })
}

export function slip10Ed25519(seed: Uint8Array, indexes: number[]): Uint8Array {
  let secret = hmac(sha512, new TextEncoder().encode('ed25519 seed'), seed)
  let key = secret.slice(0, 32)
  let chainCode = secret.slice(32)

  indexes.forEach((index) => {
    if (index < HARDENED) throw new Error('Solana 派生路径必须全部硬化')
    const data = new Uint8Array(37)
    data.set(key, 1)
    new DataView(data.buffer).setUint32(33, index, false)
    secret = hmac(sha512, chainCode, data)
    key = secret.slice(0, 32)
    chainCode = secret.slice(32)
  })

  return key
}

export async function getSolanaBalance(networkId: string, address: string): Promise<bigint> {
  decodePublicKey(address, '请输入有效的 Solana 地址')
  const result = await rpc<{ value: number }>(networkId, 'getBalance', [address, { commitment: 'confirmed' }])
  return BigInt(result?.value ?? 0)
}

export async function readSolanaToken(networkId: string, mintAddress: string) {
  const mint = decodePublicKey(mintAddress, '请输入有效的 SPL 代币 Mint 地址')
  const mintBase58 = base58.encode(mint)

  const account = await rpc<{ value: { data: [string, string]; owner: string } | null }>(
    networkId,
    'getAccountInfo',
    [mintBase58, { encoding: 'base64', commitment: 'confirmed' }]
  )
  const value = account?.value
  if (!value) throw new Error('读取代币信息失败，请确认当前网络和 Mint 地址')
  const owner = value.owner
  if (owner !== TOKEN_PROGRAM_ID && owner !== TOKEN_2022_PROGRAM_ID) {
    throw new Error('该地址不是 SPL 代币 Mint')
  }

  const data = Uint8Array.from(atob(value.data[0]), (char) => char.charCodeAt(0))
  if (data.length < 45) throw new Error('读取代币信息失败')
  const decimals = data[44]
  const symbol = await readTokenSymbol(networkId, mint)
  return {
    id: mintBase58,
    address: mintBase58,
    symbol: symbol || `${mintBase58.slice(0, 4)}…${mintBase58.slice(-4)}`,
    decimals,
  }
}

export async function getSolanaTokenBalance(networkId: string, ownerAddress: string, mintAddress: string): Promise<bigint> {
  const owner = decodePublicKey(ownerAddress, '请输入有效的 Solana 地址')
  const mint = decodePublicKey(mintAddress, '请输入有效的 SPL 代币 Mint 地址')
  const mintBase58 = base58.encode(mint)
  const mintOwner = await rpc<{ value: { owner: string } | null }>(networkId, 'getAccountInfo', [
    mintBase58,
    { encoding: 'base64', commitment: 'confirmed' },
  ])
  const programId = mintOwner?.value?.owner === TOKEN_2022_PROGRAM_ID
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID
  const ata = findProgramAddress(
    [owner, base58.decode(programId), mint],
    base58.decode(ASSOCIATED_TOKEN_PROGRAM_ID)
  )
  try {
    const balance = await rpc<{ value: { amount: string } }>(networkId, 'getTokenAccountBalance', [
      base58.encode(ata),
      { commitment: 'confirmed' },
    ])
    return BigInt(balance.value.amount)
  } catch {
    return BigInt(0)
  }
}

export function getSolanaExplorerUrl(networkId: string, address: string): string {
  const network = getSolanaNetwork(networkId)
  const cluster = network.cluster ? `?cluster=${network.cluster}` : ''
  return `https://solscan.io/account/${address}${cluster}`
}

async function readTokenSymbol(networkId: string, mint: Uint8Array): Promise<string> {
  try {
    const metadata = findProgramAddress(
      [new TextEncoder().encode('metadata'), base58.decode(METADATA_PROGRAM_ID), mint],
      base58.decode(METADATA_PROGRAM_ID)
    )
    const account = await rpc<{ value: { data: [string, string] } | null }>(networkId, 'getAccountInfo', [
      base58.encode(metadata),
      { encoding: 'base64', commitment: 'confirmed' },
    ])
    if (!account?.value) return ''
    const data = Uint8Array.from(atob(account.value.data[0]), (char) => char.charCodeAt(0))
    let offset = 1 + 32 + 32
    const name = readBorshString(data, offset)
    offset = name.offset
    return readBorshString(data, offset).value
  } catch {
    return ''
  }
}

function readBorshString(data: Uint8Array, offset: number): { value: string; offset: number } {
  if (offset + 4 > data.length) return { value: '', offset }
  const length = new DataView(data.buffer, data.byteOffset + offset, 4).getUint32(0, true)
  const start = offset + 4
  const end = Math.min(start + length, data.length)
  const value = new TextDecoder().decode(data.slice(start, end)).replace(/\0/g, '').trim()
  return { value, offset: start + length }
}

function decodePublicKey(value: string, message: string): Uint8Array {
  try {
    const bytes = base58.decode(value.trim())
    if (bytes.length !== 32) throw new Error(message)
    return bytes
  } catch (error) {
    if (error instanceof Error && error.message === message) throw error
    throw new Error(message)
  }
}

function findProgramAddress(seeds: Uint8Array[], programId: Uint8Array): Uint8Array {
  for (let bump = 255; bump >= 0; bump -= 1) {
    const hash = sha256(concat([...seeds, Uint8Array.of(bump), programId, PDA_MARKER]))
    if (!isOnCurve(hash)) return hash
  }
  throw new Error('无法派生关联账户')
}

function isOnCurve(bytes: Uint8Array): boolean {
  try {
    const point = (ed25519 as unknown as { ExtendedPoint: { fromHex: (value: Uint8Array) => unknown } }).ExtendedPoint
    point.fromHex(bytes)
    return true
  } catch {
    return false
  }
}

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0))
  let offset = 0
  parts.forEach((part) => {
    out.set(part, offset)
    offset += part.length
  })
  return out
}

async function rpc<T>(networkId: string, method: string, params: unknown[]): Promise<T> {
  const network = getSolanaNetwork(networkId)
  const response = await fetch(network.rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) throw new Error('查询失败')
  const json = await response.json()
  if (json.error) throw new Error(json.error.message || '查询失败')
  return json.result as T
}
