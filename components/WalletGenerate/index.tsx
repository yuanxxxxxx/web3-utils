'use client'

import { useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
  createPublicClient,
  erc20Abi,
  getAddress,
  hexToString,
  http,
  isAddress,
} from 'viem'
import type { PublicClient } from 'viem'
import {
  createMnemonic,
  deriveWallets,
  formatTokenAmount,
  mapPool,
  normalizeMnemonic,
  type IDerivedWallet,
} from '@/utils/wallet'
import { getAddressExplorerUrl, getChainRpcUrl, WALLET_CHAINS } from './chains'
import {
  AccountCard,
  AccountHead,
  AccountIndex,
  AccountList,
  AccountPath,
  ActionRow,
  BalanceAmount,
  BalanceLine,
  BalanceList,
  BalanceSymbol,
  ChainMeta,
  ChainRow,
  ChainSelect,
  CountField,
  CountInput,
  DeriveRow,
  DirtyHint,
  EmptyState,
  FieldLabel,
  GhostButton,
  Hint,
  InlineLink,
  MnemonicArea,
  PageHeader,
  PageSubtitle,
  PageTitle,
  Panel,
  PanelTitle,
  PrimaryButton,
  SecondaryButton,
  SecretLabel,
  SecretRow,
  SecretValue,
  SelectArrow,
  SelectWrap,
  SummaryBox,
  TokenInput,
  TokenItem,
  TokenList,
  TokenMain,
  ToolWrapper,
  Warning,
} from './style'

interface IWatchToken {
  address: `0x${string}`
  symbol: string
  decimals: number
}

interface ITokenBalanceState {
  raw?: string
  error?: string
}

interface IAddressBalanceState {
  nativeRaw?: string
  nativeError?: string
  tokens: Record<string, ITokenBalanceState>
}

const bytes32SymbolAbi = [
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'bytes32' }],
  },
] as const

const mainnetChains = WALLET_CHAINS.filter((chain) => !chain.testnet)
const testnetChains = WALLET_CHAINS.filter((chain) => chain.testnet)

async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`已复制${label}`)
  } catch {
    toast.error('复制失败')
  }
}

async function readTokenMeta(client: PublicClient, address: `0x${string}`) {
  const decimals = await client.readContract({
    address,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  try {
    const symbol = await client.readContract({
      address,
      abi: erc20Abi,
      functionName: 'symbol',
    })
    const normalized = symbol.trim()
    if (!normalized) throw new Error('empty symbol')
    return { symbol: normalized, decimals }
  } catch {
    const raw = await client.readContract({
      address,
      abi: bytes32SymbolAbi,
      functionName: 'symbol',
    })
    const symbol = hexToString(raw, { size: 32 }).replace(/\u0000/g, '').trim()
    if (!symbol) throw new Error('无法读取代币符号')
    return { symbol, decimals }
  }
}

export default function WalletGenerate() {
  const [mnemonic, setMnemonic] = useState('')
  const [derivedMnemonic, setDerivedMnemonic] = useState('')
  const [countInput, setCountInput] = useState('5')
  const [wallets, setWallets] = useState<IDerivedWallet[]>([])
  const [selectedChainId, setSelectedChainId] = useState(WALLET_CHAINS[0].id)
  const [tokenInput, setTokenInput] = useState('')
  const [tokens, setTokens] = useState<IWatchToken[]>([])
  const [balances, setBalances] = useState<Record<string, IAddressBalanceState>>({})
  const [nativeLoading, setNativeLoading] = useState<Record<string, boolean>>({})
  const [tokenLoading, setTokenLoading] = useState<Record<string, boolean>>({})
  const [addingToken, setAddingToken] = useState(false)
  const [batchLoading, setBatchLoading] = useState(false)
  const epochRef = useRef(0)

  const selectedChain = useMemo(
    () => WALLET_CHAINS.find((chain) => chain.id === selectedChainId) ?? WALLET_CHAINS[0],
    [selectedChainId]
  )

  const client = useMemo(
    () =>
      createPublicClient({
        chain: selectedChain,
        transport: http(getChainRpcUrl(selectedChain), { timeout: 20_000, retryCount: 1 }),
      }),
    [selectedChain]
  )

  const nativeSymbol = selectedChain.nativeCurrency.symbol
  const mnemonicDirty =
    wallets.length > 0 && normalizeMnemonic(mnemonic) !== derivedMnemonic

  const summary = useMemo(() => {
    let nativeQueried = 0
    let nativeTotal = BigInt(0)
    const tokenTotals = tokens.map((token) => ({
      token,
      queried: 0,
      total: BigInt(0),
    }))

    wallets.forEach((wallet) => {
      const state = balances[wallet.address.toLowerCase()]
      if (!state) return
      if (state.nativeRaw) {
        nativeQueried += 1
        nativeTotal += BigInt(state.nativeRaw)
      }
      tokenTotals.forEach((item) => {
        const tokenState = state.tokens[item.token.address.toLowerCase()]
        if (!tokenState?.raw) return
        item.queried += 1
        item.total += BigInt(tokenState.raw)
      })
    })

    if (nativeQueried === 0 && tokenTotals.every((item) => item.queried === 0)) return null
    return { nativeQueried, nativeTotal, tokenTotals }
  }, [balances, tokens, wallets])

  const clearQueryState = () => {
    epochRef.current += 1
    setBalances({})
    setNativeLoading({})
    setTokenLoading({})
    setBatchLoading(false)
  }

  const handleDerive = (phrase: string) => {
    if (!/^\d+$/.test(countInput.trim())) {
      toast.error('请输入派生数量')
      return
    }
    try {
      const nextWallets = deriveWallets(phrase, Number(countInput.trim()))
      clearQueryState()
      setWallets(nextWallets)
      setDerivedMnemonic(normalizeMnemonic(phrase))
      setMnemonic(normalizeMnemonic(phrase))
      toast.success(`已生成 ${nextWallets.length} 个地址`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '生成地址失败')
    }
  }

  const handleGenerate = (wordCount: 12 | 24) => {
    const phrase = createMnemonic(wordCount)
    setMnemonic(phrase)
    handleDerive(phrase)
  }

  const handleClear = () => {
    clearQueryState()
    setMnemonic('')
    setDerivedMnemonic('')
    setWallets([])
    setTokens([])
    setTokenInput('')
  }

  const handleSelectChain = (chainId: number) => {
    if (chainId === selectedChainId) return
    const hadTokens = tokens.length > 0
    clearQueryState()
    setSelectedChainId(chainId)
    setTokens([])
    if (hadTokens) toast('已切换网络，请重新添加当前链的代币')
  }

  const handleAddToken = async () => {
    const raw = tokenInput.trim()
    if (!isAddress(raw)) {
      toast.error('请输入有效的代币合约地址')
      return
    }
    const address = getAddress(raw)
    if (tokens.some((token) => token.address.toLowerCase() === address.toLowerCase())) {
      toast.error('该代币已添加')
      return
    }

    const epoch = epochRef.current
    setAddingToken(true)
    try {
      const meta = await readTokenMeta(client, address)
      if (epochRef.current !== epoch) return
      setTokens((prev) => {
        if (prev.some((token) => token.address.toLowerCase() === address.toLowerCase())) return prev
        return [...prev, { address, symbol: meta.symbol, decimals: meta.decimals }]
      })
      setTokenInput('')
      toast.success(`已添加 ${meta.symbol}`)
    } catch {
      if (epochRef.current === epoch) {
        toast.error('读取代币信息失败，请确认当前网络和合约地址')
      }
    } finally {
      if (epochRef.current === epoch) setAddingToken(false)
    }
  }

  const removeToken = (address: `0x${string}`) => {
    const key = address.toLowerCase()
    setTokens((prev) => prev.filter((token) => token.address.toLowerCase() !== key))
    setBalances((prev) => {
      const next: Record<string, IAddressBalanceState> = {}
      Object.entries(prev).forEach(([walletKey, state]) => {
        const tokenMap = { ...state.tokens }
        delete tokenMap[key]
        next[walletKey] = { ...state, tokens: tokenMap }
      })
      return next
    })
  }

  const queryNative = async (wallet: IDerivedWallet) => {
    const epoch = epochRef.current
    const decimals = selectedChain.nativeCurrency.decimals
    const key = wallet.address.toLowerCase()
    setNativeLoading((prev) => ({ ...prev, [key]: true }))
    try {
      const value = await client.getBalance({ address: wallet.address })
      if (epochRef.current !== epoch) return
      setBalances((prev) => {
        const current = prev[key] ?? { tokens: {} }
        return {
          ...prev,
          [key]: {
            ...current,
            nativeRaw: value.toString(),
            nativeError: undefined,
          },
        }
      })
    } catch {
      if (epochRef.current !== epoch) return
      setBalances((prev) => {
        const current = prev[key] ?? { tokens: {} }
        return {
          ...prev,
          [key]: {
            ...current,
            nativeRaw: undefined,
            nativeError: '查询失败',
          },
        }
      })
      toast.error(`${nativeSymbol} 余额查询失败`)
    } finally {
      if (epochRef.current === epoch) {
        setNativeLoading((prev) => ({ ...prev, [key]: false }))
      }
    }
  }

  const queryTokens = async (wallet: IDerivedWallet) => {
    if (tokens.length === 0) {
      toast.error('请先添加代币')
      return
    }
    const epoch = epochRef.current
    const key = wallet.address.toLowerCase()
    const tokenList = tokens
    setTokenLoading((prev) => ({ ...prev, [key]: true }))
    try {
      const results = await Promise.all(
        tokenList.map(async (token) => {
          try {
            const value = await client.readContract({
              address: token.address,
              abi: erc20Abi,
              functionName: 'balanceOf',
              args: [wallet.address],
            })
            return { address: token.address, raw: value.toString() }
          } catch {
            return { address: token.address, error: '查询失败' }
          }
        })
      )
      if (epochRef.current !== epoch) return
      setBalances((prev) => {
        const current = prev[key] ?? { tokens: {} }
        const tokenMap = { ...current.tokens }
        results.forEach((item) => {
          tokenMap[item.address.toLowerCase()] = item.raw
            ? { raw: item.raw }
            : { error: item.error }
        })
        return { ...prev, [key]: { ...current, tokens: tokenMap } }
      })
      if (results.some((item) => item.error)) toast.error('部分代币余额查询失败')
    } finally {
      if (epochRef.current === epoch) {
        setTokenLoading((prev) => ({ ...prev, [key]: false }))
      }
    }
  }

  const queryAll = async () => {
    if (wallets.length === 0) {
      toast.error('请先生成地址')
      return
    }
    const epoch = epochRef.current
    const decimals = selectedChain.nativeCurrency.decimals
    const walletList = wallets
    const tokenList = tokens
    setBatchLoading(true)
    try {
      const nativeResults = await mapPool(walletList, 8, async (wallet) => {
        try {
          const value = await client.getBalance({ address: wallet.address })
          return { address: wallet.address, raw: value.toString() }
        } catch {
          return { address: wallet.address, error: '查询失败' }
        }
      })
      if (epochRef.current !== epoch) return

      const tokenResults = await queryTokenBalances(client, walletList, tokenList)
      if (epochRef.current !== epoch) return

      const next: Record<string, IAddressBalanceState> = {}
      nativeResults.forEach((item) => {
        const key = item.address.toLowerCase()
        next[key] = {
          tokens: {},
          nativeRaw: item.raw,
          nativeError: item.error,
        }
      })
      tokenResults.forEach((item) => {
        const key = item.wallet.toLowerCase()
        const current = next[key] ?? { tokens: {} }
        current.tokens[item.token.toLowerCase()] = item.raw
          ? { raw: item.raw }
          : { error: item.error || '查询失败' }
        next[key] = current
      })
      setBalances(next)

      const hasFailure =
        nativeResults.some((item) => item.error) || tokenResults.some((item) => item.error)
      if (hasFailure) toast.error('部分余额查询失败')
      else toast.success('余额查询完成')
    } finally {
      if (epochRef.current === epoch) setBatchLoading(false)
    }
  }

  return (
    <ToolWrapper>
      <PageHeader>
        <PageTitle>区块链钱包生成</PageTitle>
        <PageSubtitle>
          在浏览器内生成或导入 EVM 助记词，按 BIP44 路径派生地址，并查询原生币和代币余额。数据只留在当前页面内存中，刷新后即消失。
        </PageSubtitle>
      </PageHeader>

      <Panel>
        <PanelTitle>助记词</PanelTitle>
        <Warning>
          助记词和私钥以明文显示，且不会写入本地存储。请只在你信任的设备上使用，不要把助记词发给任何人。
        </Warning>
        <MnemonicArea
          value={mnemonic}
          placeholder="粘贴 12 / 15 / 18 / 21 / 24 个英文单词，或点击下方按钮一键生成"
          onChange={(event) => setMnemonic(event.target.value)}
        />
        <ActionRow>
          <PrimaryButton type="button" onClick={() => handleGenerate(12)}>
            生成 12 位助记词
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => handleGenerate(24)}>
            生成 24 位助记词
          </SecondaryButton>
          <GhostButton type="button" disabled={!mnemonic} onClick={() => copyText(mnemonic, '助记词')}>
            复制助记词
          </GhostButton>
          <GhostButton type="button" onClick={handleClear}>
            清空
          </GhostButton>
        </ActionRow>
        <DeriveRow>
          <CountField>
            <FieldLabel htmlFor="derive-count">派生数量</FieldLabel>
            <CountInput
              id="derive-count"
              inputMode="numeric"
              value={countInput}
              onChange={(event) => setCountInput(event.target.value.replace(/[^\d]/g, ''))}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleDerive(mnemonic)
              }}
            />
          </CountField>
          <PrimaryButton type="button" onClick={() => handleDerive(mnemonic)}>
            生成地址
          </PrimaryButton>
        </DeriveRow>
        <Hint>派生路径为 m/44&apos;/60&apos;/0&apos;/0/index，与 MetaMask 等 EVM 钱包一致。数量范围 1 到 100。</Hint>
        {mnemonicDirty && <DirtyHint>助记词已修改，请重新生成地址。</DirtyHint>}
      </Panel>

      <Panel>
        <PanelTitle>余额查询</PanelTitle>
        <ChainRow>
          <FieldLabel htmlFor="wallet-chain">切换网络</FieldLabel>
          <SelectWrap>
            <ChainSelect
              id="wallet-chain"
              value={selectedChainId}
              onChange={(event) => handleSelectChain(Number(event.target.value))}
            >
              <optgroup label="主网">
                {mainnetChains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name} ({chain.nativeCurrency.symbol})
                  </option>
                ))}
              </optgroup>
              {testnetChains.length > 0 && (
                <optgroup label="测试网">
                  {testnetChains.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.name} ({chain.nativeCurrency.symbol})
                    </option>
                  ))}
                </optgroup>
              )}
            </ChainSelect>
            <SelectArrow>▼</SelectArrow>
          </SelectWrap>
          <ChainMeta>
            Chain ID {selectedChain.id} · {nativeSymbol}
          </ChainMeta>
        </ChainRow>

        <FieldLabel htmlFor="token-address">添加代币</FieldLabel>
        <ActionRow>
          <TokenInput
            id="token-address"
            value={tokenInput}
            placeholder="代币合约地址，例如 0xdAC17F958D2ee523a2206206994597C13D831ec7"
            onChange={(event) => setTokenInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleAddToken()
            }}
          />
          <SecondaryButton type="button" disabled={addingToken} onClick={handleAddToken}>
            {addingToken ? '读取中...' : '添加代币'}
          </SecondaryButton>
        </ActionRow>
        {tokens.length > 0 && (
          <TokenList>
            {tokens.map((token) => (
              <TokenItem key={token.address}>
                <TokenMain>
                  <strong>
                    {token.symbol} · decimals {token.decimals}
                  </strong>
                  <span>{token.address}</span>
                </TokenMain>
                <GhostButton type="button" onClick={() => removeToken(token.address)}>
                  移除
                </GhostButton>
              </TokenItem>
            ))}
          </TokenList>
        )}
        <Hint>代币需要是当前网络上的合约。切换网络后会清空已添加的代币。</Hint>

        <PrimaryButton type="button" disabled={batchLoading || wallets.length === 0} onClick={queryAll}>
          {batchLoading ? '查询中...' : '一键查询余额'}
        </PrimaryButton>
        {summary && (
          <SummaryBox>
            {summary.nativeQueried > 0 && (
              <div>
                {nativeSymbol} 合计 {formatTokenAmount(summary.nativeTotal, selectedChain.nativeCurrency.decimals)}（
                {summary.nativeQueried}/{wallets.length}）
              </div>
            )}
            {summary.tokenTotals
              .filter((item) => item.queried > 0)
              .map((item) => (
                <div key={item.token.address}>
                  {item.token.symbol} 合计 {formatTokenAmount(item.total, item.token.decimals)}（
                  {item.queried}/{wallets.length}）
                </div>
              ))}
          </SummaryBox>
        )}
      </Panel>

      <Panel>
        <PanelTitle>派生地址 {wallets.length > 0 ? `· ${wallets.length}` : ''}</PanelTitle>
        {wallets.length === 0 ? (
          <EmptyState>
            <div className="icon">👛</div>
            生成或导入助记词后，地址、私钥和余额会显示在这里
          </EmptyState>
        ) : (
          <AccountList>
            {wallets.map((wallet) => {
              const key = wallet.address.toLowerCase()
              const state = balances[key]
              const explorerUrl = getAddressExplorerUrl(selectedChain, wallet.address)
              const nativeText = state?.nativeError
                ? state.nativeError
                : state?.nativeRaw
                  ? `${formatTokenAmount(BigInt(state.nativeRaw), selectedChain.nativeCurrency.decimals)} ${nativeSymbol}`
                  : batchLoading
                    ? '查询中...'
                    : '未查询'
              return (
                <AccountCard key={wallet.path}>
                  <AccountHead>
                    <AccountIndex>账户 {wallet.index + 1}</AccountIndex>
                    <AccountPath>{wallet.path}</AccountPath>
                  </AccountHead>
                  <SecretRow>
                    <SecretLabel>地址</SecretLabel>
                    <SecretValue>{wallet.address}</SecretValue>
                    <GhostButton type="button" onClick={() => copyText(wallet.address, '地址')}>
                      复制
                    </GhostButton>
                    {explorerUrl && (
                      <InlineLink href={explorerUrl} target="_blank" rel="noopener noreferrer">
                        浏览器
                      </InlineLink>
                    )}
                  </SecretRow>
                  <SecretRow>
                    <SecretLabel>私钥</SecretLabel>
                    <SecretValue>{wallet.privateKey}</SecretValue>
                    <GhostButton type="button" onClick={() => copyText(wallet.privateKey, '私钥')}>
                      复制
                    </GhostButton>
                  </SecretRow>
                  <BalanceList>
                    <BalanceLine>
                      <BalanceSymbol>{nativeSymbol}</BalanceSymbol>
                      <BalanceAmount $error={!!state?.nativeError}>{nativeText}</BalanceAmount>
                    </BalanceLine>
                    {tokens.map((token) => {
                      const tokenState = state?.tokens[token.address.toLowerCase()]
                      const text = tokenState?.error
                        ? tokenState.error
                        : tokenState?.raw
                          ? formatTokenAmount(BigInt(tokenState.raw), token.decimals)
                          : batchLoading || tokenLoading[key]
                            ? '查询中...'
                            : '未查询'
                      return (
                        <BalanceLine key={token.address}>
                          <BalanceSymbol>{token.symbol}</BalanceSymbol>
                          <BalanceAmount $error={!!tokenState?.error}>{text}</BalanceAmount>
                        </BalanceLine>
                      )
                    })}
                  </BalanceList>
                  <ActionRow>
                    <SecondaryButton
                      type="button"
                      disabled={batchLoading || nativeLoading[key]}
                      onClick={() => queryNative(wallet)}
                    >
                      {nativeLoading[key] ? '查询中...' : `查询${nativeSymbol}余额`}
                    </SecondaryButton>
                    <SecondaryButton
                      type="button"
                      disabled={batchLoading || tokenLoading[key]}
                      onClick={() => queryTokens(wallet)}
                    >
                      {tokenLoading[key] ? '查询中...' : '查询代币余额'}
                    </SecondaryButton>
                  </ActionRow>
                </AccountCard>
              )
            })}
          </AccountList>
        )}
      </Panel>
    </ToolWrapper>
  )
}

interface ITokenQueryResult {
  wallet: `0x${string}`
  token: `0x${string}`
  raw?: string
  error?: string
}

async function queryTokenBalances(
  client: PublicClient,
  wallets: IDerivedWallet[],
  tokens: IWatchToken[]
): Promise<ITokenQueryResult[]> {
  if (tokens.length === 0 || wallets.length === 0) return []
  const jobs = wallets.flatMap((wallet) => tokens.map((token) => ({ wallet, token })))

  try {
    const results: ITokenQueryResult[] = []
    for (let offset = 0; offset < jobs.length; offset += 80) {
      const chunk = jobs.slice(offset, offset + 80)
      const part = await client.multicall({
        contracts: chunk.map(({ wallet, token }) => ({
          address: token.address,
          abi: erc20Abi,
          functionName: 'balanceOf' as const,
          args: [wallet.address] as const,
        })),
        allowFailure: true,
      })
      part.forEach((item, index) => {
        const job = chunk[index]
        if (item.status === 'success') {
          results.push({
            wallet: job.wallet.address,
            token: job.token.address,
            raw: item.result.toString(),
          })
        } else {
          results.push({
            wallet: job.wallet.address,
            token: job.token.address,
            error: '查询失败',
          })
        }
      })
    }
    return results
  } catch {
    return mapPool(jobs, 6, async ({ wallet, token }) => {
      try {
        const value = await client.readContract({
          address: token.address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [wallet.address],
        })
        return { wallet: wallet.address, token: token.address, raw: value.toString() }
      } catch {
        return { wallet: wallet.address, token: token.address, error: '查询失败' }
      }
    })
  }
}
