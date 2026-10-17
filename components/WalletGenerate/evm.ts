import {
  createPublicClient,
  erc20Abi,
  getAddress,
  hexToString,
  http,
  isAddress,
} from 'viem'
import type { PublicClient } from 'viem'
import { deriveWallets, mapPool } from '@/utils/wallet'
import type { IDerivedAccount, ITokenBalanceResult, IWatchToken } from '@/components/ChainWallet/types'
import { getAddressExplorerUrl, getChainRpcUrl, WALLET_CHAINS } from './chains'

const bytes32SymbolAbi = [
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'bytes32' }],
  },
] as const

const clients = new Map<string, PublicClient>()

export const EVM_CHAIN_OPTIONS = WALLET_CHAINS.map((chain) => ({
  id: String(chain.id),
  name: chain.name,
  symbol: chain.nativeCurrency.symbol,
  decimals: chain.nativeCurrency.decimals,
  isTestnet: Boolean(chain.testnet),
  meta: `Chain ID ${chain.id} · ${chain.nativeCurrency.symbol}`,
}))

function getChain(chainId: string) {
  const chain = WALLET_CHAINS.find((item) => String(item.id) === chainId)
  if (!chain) throw new Error('未知网络')
  return chain
}

function getClient(chainId: string) {
  const cached = clients.get(chainId)
  if (cached) return cached
  const chain = getChain(chainId)
  const client = createPublicClient({
    chain,
    transport: http(getChainRpcUrl(chain), { timeout: 20_000, retryCount: 1 }),
  })
  clients.set(chainId, client)
  return client
}

export function deriveEvmWallets(mnemonic: string, count: number): IDerivedAccount[] {
  return deriveWallets(mnemonic, count)
}

export function getEvmExplorerUrl(chainId: string, address: string): string {
  return getAddressExplorerUrl(getChain(chainId), address)
}

export async function getEvmBalance(chainId: string, address: string): Promise<bigint> {
  return getClient(chainId).getBalance({ address: address as `0x${string}` })
}

export async function readEvmToken(chainId: string, input: string): Promise<IWatchToken> {
  const raw = input.trim()
  if (!isAddress(raw)) throw new Error('请输入有效的代币合约地址')
  const address = getAddress(raw)
  const client = getClient(chainId)
  const decimals = await client.readContract({
    address,
    abi: erc20Abi,
    functionName: 'decimals',
  })
  let symbol = ''
  try {
    symbol = (await client.readContract({
      address,
      abi: erc20Abi,
      functionName: 'symbol',
    })).trim()
  } catch {
    const rawSymbol = await client.readContract({
      address,
      abi: bytes32SymbolAbi,
      functionName: 'symbol',
    })
    symbol = hexToString(rawSymbol, { size: 32 }).replace(/\u0000/g, '').trim()
  }
  if (!symbol) throw new Error('读取代币信息失败，请确认当前网络和合约地址')
  return { id: address.toLowerCase(), address, symbol, decimals }
}

export async function getEvmTokenBalance(chainId: string, owner: string, token: IWatchToken): Promise<bigint> {
  return getClient(chainId).readContract({
    address: token.address as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [owner as `0x${string}`],
  })
}

export async function getEvmTokenBalances(
  chainId: string,
  wallets: IDerivedAccount[],
  tokens: IWatchToken[]
): Promise<ITokenBalanceResult[]> {
  if (tokens.length === 0 || wallets.length === 0) return []
  const client = getClient(chainId)
  const jobs = wallets.flatMap((wallet) => tokens.map((token) => ({ wallet, token })))

  try {
    const results: ITokenBalanceResult[] = []
    for (let offset = 0; offset < jobs.length; offset += 80) {
      const chunk = jobs.slice(offset, offset + 80)
      const part = await client.multicall({
        contracts: chunk.map(({ wallet, token }) => ({
          address: token.address as `0x${string}`,
          abi: erc20Abi,
          functionName: 'balanceOf' as const,
          args: [wallet.address as `0x${string}`] as const,
        })),
        allowFailure: true,
      })
      part.forEach((item, index) => {
        const job = chunk[index]
        if (item.status === 'success') {
          results.push({ wallet: job.wallet.address, token: job.token.id, raw: item.result.toString() })
        } else {
          results.push({ wallet: job.wallet.address, token: job.token.id, error: '查询失败' })
        }
      })
    }
    return results
  } catch {
    return mapPool(jobs, 6, async ({ wallet, token }) => {
      try {
        const value = await getEvmTokenBalance(chainId, wallet.address, token)
        return { wallet: wallet.address, token: token.id, raw: value.toString() }
      } catch {
        return { wallet: wallet.address, token: token.id, error: '查询失败' }
      }
    })
  }
}
