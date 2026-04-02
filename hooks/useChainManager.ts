'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createPublicClient, http, Chain } from 'viem'
import { WEBSITE_CONFIG } from '@/types/constant'

export interface CustomChain {
  id: number
  name: string
  rpcUrl: string
  symbol: string
  explorerUrl?: string
}

export interface ChainOption {
  id: number
  name: string
  isCustom: boolean
  symbol: string
  explorerUrl?: string
  rpcUrl?: string
}

const CUSTOM_CHAINS_KEY = 'CONTRACT_TOOL_CUSTOM_CHAINS'

export const PRESET_CHAINS: Chain[] = WEBSITE_CONFIG.supperChains

export const PRESET_CHAIN_OPTIONS: ChainOption[] = PRESET_CHAINS.map((chain) => ({
  id: chain.id,
  name: chain.name,
  isCustom: false,
  symbol: chain.nativeCurrency.symbol,
  explorerUrl: chain.blockExplorers?.default?.url,
}))

function buildViemChain(custom: CustomChain): Chain {
  return {
    id: custom.id,
    name: custom.name,
    nativeCurrency: { name: custom.symbol, symbol: custom.symbol, decimals: 18 },
    rpcUrls: {
      default: { http: [custom.rpcUrl] },
    },
    ...(custom.explorerUrl
      ? { blockExplorers: { default: { name: 'Explorer', url: custom.explorerUrl } } }
      : {}),
  }
}

export default function useChainManager() {
  const [selectedChainId, setSelectedChainId] = useState<number>(WEBSITE_CONFIG.defaultChain.id)
  const [customChains, setCustomChains] = useState<CustomChain[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_CHAINS_KEY)
      if (stored) {
        setCustomChains(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
    setInitialized(true)
  }, [])

  const saveCustomChains = useCallback((chains: CustomChain[]) => {
    setCustomChains(chains)
    try {
      localStorage.setItem(CUSTOM_CHAINS_KEY, JSON.stringify(chains))
    } catch {
      // ignore
    }
  }, [])

  const addCustomChain = useCallback(
    (chain: CustomChain) => {
      const updated = [...customChains.filter((c) => c.id !== chain.id), chain]
      saveCustomChains(updated)
    },
    [customChains, saveCustomChains]
  )

  const removeCustomChain = useCallback(
    (chainId: number) => {
      const updated = customChains.filter((c) => c.id !== chainId)
      saveCustomChains(updated)
      if (selectedChainId === chainId) {
        setSelectedChainId(WEBSITE_CONFIG.defaultChain.id)
      }
    },
    [customChains, saveCustomChains, selectedChainId]
  )

  const allChainOptions: ChainOption[] = useMemo(
    () => [
      ...PRESET_CHAIN_OPTIONS,
      ...customChains.map((c) => ({
        id: c.id,
        name: c.name,
        isCustom: true,
        symbol: c.symbol,
        explorerUrl: c.explorerUrl,
        rpcUrl: c.rpcUrl,
      })),
    ],
    [customChains]
  )

  const selectedChain = useMemo(() => {
    const preset = PRESET_CHAINS.find((c) => c.id === selectedChainId)
    if (preset) return preset
    const custom = customChains.find((c) => c.id === selectedChainId)
    if (custom) return buildViemChain(custom)
    return WEBSITE_CONFIG.defaultChain
  }, [selectedChainId, customChains])

  const selectedChainRpcUrl = useMemo(() => {
    const custom = customChains.find((c) => c.id === selectedChainId)
    if (custom) return custom.rpcUrl
    return undefined
  }, [selectedChainId, customChains])

  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: selectedChain,
      transport: selectedChainRpcUrl ? http(selectedChainRpcUrl) : http(),
    })
  }, [selectedChain, selectedChainRpcUrl])

  const getExplorerUrl = useCallback(
    (value: string, type: 'address' | 'tx'): string => {
      const option = allChainOptions.find((c) => c.id === selectedChainId)
      const base = option?.explorerUrl
      if (!base) return ''
      return type === 'address' ? `${base}/address/${value}` : `${base}/tx/${value}`
    },
    [allChainOptions, selectedChainId]
  )

  return {
    selectedChainId,
    setSelectedChainId,
    customChains,
    allChainOptions,
    selectedChain,
    publicClient,
    addCustomChain,
    removeCustomChain,
    getExplorerUrl,
    initialized,
  }
}
