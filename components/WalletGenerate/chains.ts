import type { Chain } from 'viem'
import {
  abstract,
  apeChain,
  arbitrum,
  aurora,
  avalanche,
  base,
  berachain,
  blast,
  bob,
  bsc,
  bscTestnet,
  celo,
  coreDao,
  cronos,
  fantom,
  filecoin,
  fraxtal,
  gnosis,
  gravity,
  hyperEvm,
  ink,
  kaia,
  linea,
  lisk,
  mainnet,
  manta,
  mantle,
  metis,
  mode,
  opBNB,
  optimism,
  polygon,
  polygonZkEvm,
  scroll,
  sei,
  sepolia,
  soneium,
  sonic,
  story,
  taiko,
  unichain,
  worldchain,
  xLayer,
  zkSync,
  zora,
} from 'viem/chains'

const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11' as const

function withRpc(chain: Chain, rpcUrl: string): Chain {
  return {
    ...chain,
    rpcUrls: {
      ...chain.rpcUrls,
      default: {
        ...chain.rpcUrls.default,
        http: [rpcUrl],
      },
    },
  }
}

function ensureMulticall3(chain: Chain): Chain {
  if (chain.contracts?.multicall3?.address) return chain
  return {
    ...chain,
    contracts: {
      ...chain.contracts,
      multicall3: {
        address: MULTICALL3_ADDRESS,
      },
    },
  }
}

export const WALLET_CHAINS: Chain[] = [
  withRpc(mainnet, 'https://ethereum-rpc.publicnode.com'),
  withRpc(bsc, 'https://bsc-rpc.publicnode.com'),
  withRpc(polygon, 'https://polygon-bor-rpc.publicnode.com'),
  arbitrum,
  withRpc(optimism, 'https://optimism-rpc.publicnode.com'),
  withRpc(base, 'https://base-rpc.publicnode.com'),
  withRpc(avalanche, 'https://avalanche-c-chain-rpc.publicnode.com'),
  withRpc(linea, 'https://linea-rpc.publicnode.com'),
  withRpc(scroll, 'https://scroll-rpc.publicnode.com'),
  zkSync,
  withRpc(gnosis, 'https://gnosis-rpc.publicnode.com'),
  withRpc(mantle, 'https://mantle-rpc.publicnode.com'),
  blast,
  celo,
  cronos,
  opBNB,
  polygonZkEvm,
  taiko,
  sei,
  sonic,
  withRpc(fantom, 'https://rpcapi.fantom.network'),
  unichain,
  berachain,
  worldchain,
  ink,
  soneium,
  abstract,
  ensureMulticall3(hyperEvm),
  mode,
  manta,
  withRpc(apeChain, 'https://rpc.apechain.com'),
  kaia,
  fraxtal,
  aurora,
  withRpc(metis, 'https://andromeda.metis.io/?owner=1088'),
  coreDao,
  xLayer,
  zora,
  filecoin,
  bob,
  lisk,
  gravity,
  story,
  withRpc(sepolia, 'https://ethereum-sepolia-rpc.publicnode.com'),
  withRpc(bscTestnet, 'https://bsc-testnet-rpc.publicnode.com'),
]

export function getChainRpcUrl(chain: Chain): string {
  const rpcUrl = chain.rpcUrls.default.http[0]
  if (!rpcUrl) {
    throw new Error(`${chain.name} 缺少 RPC`)
  }
  return rpcUrl
}

export function getAddressExplorerUrl(chain: Chain, address: string): string {
  const base = chain.blockExplorers?.default?.url
  if (!base) return ''
  return `${base.replace(/\/$/, '')}/address/${address}`
}
