'use client'

import { useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
  MAX_DERIVE_COUNT,
  MIN_DERIVE_COUNT,
  createMnemonic,
  formatTokenAmount,
  mapPool,
  normalizeMnemonic,
} from '@/utils/wallet'
import type { ChainWalletProps, IDerivedAccount, IWatchToken } from './types'
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

interface ITokenBalanceState {
  raw?: string
  error?: string
}

interface IAddressBalanceState {
  nativeRaw?: string
  nativeError?: string
  tokens: Record<string, ITokenBalanceState>
}

async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`已复制${label}`)
  } catch {
    toast.error('复制失败')
  }
}

function parseCount(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null
  const count = Number(value.trim())
  if (count < MIN_DERIVE_COUNT || count > MAX_DERIVE_COUNT) return null
  return count
}

export default function ChainWallet({
  title,
  subtitle,
  pathHint,
  chains,
  defaultChainId,
  derive,
  getExplorerUrl,
  getNativeBalance,
  supportsTokens = true,
  tokenPlaceholder = '代币合约地址',
  tokenHint = '代币需要是当前网络上的合约。切换网络后会清空已添加的代币。',
  variants = [],
  defaultVariantId,
  variantLabel = '地址类型',
  rederiveOnChainChange = false,
  readToken,
  getTokenBalance,
  getTokenBalances,
}: ChainWalletProps) {
  const [mnemonic, setMnemonic] = useState('')
  const [derivedMnemonic, setDerivedMnemonic] = useState('')
  const [countInput, setCountInput] = useState('5')
  const [wallets, setWallets] = useState<IDerivedAccount[]>([])
  const [selectedChainId, setSelectedChainId] = useState(defaultChainId)
  const [variantId, setVariantId] = useState(defaultVariantId || variants[0]?.id || '')
  const [tokenInput, setTokenInput] = useState('')
  const [tokens, setTokens] = useState<IWatchToken[]>([])
  const [balances, setBalances] = useState<Record<string, IAddressBalanceState>>({})
  const [nativeLoading, setNativeLoading] = useState<Record<string, boolean>>({})
  const [tokenLoading, setTokenLoading] = useState<Record<string, boolean>>({})
  const [addingToken, setAddingToken] = useState(false)
  const [batchLoading, setBatchLoading] = useState(false)
  const epochRef = useRef(0)

  const selectedChain = useMemo(
    () => chains.find((chain) => chain.id === selectedChainId) ?? chains[0],
    [chains, selectedChainId]
  )
  const mainnetChains = chains.filter((chain) => !chain.isTestnet)
  const testnetChains = chains.filter((chain) => chain.isTestnet)
  const nativeSymbol = selectedChain.symbol
  const mnemonicDirty = wallets.length > 0 && normalizeMnemonic(mnemonic) !== derivedMnemonic
  const hint = typeof pathHint === 'function'
    ? pathHint({ chainId: selectedChainId, variantId })
    : pathHint

  const summary = useMemo(() => {
    let nativeQueried = 0
    let nativeTotal = BigInt(0)
    const tokenTotals = tokens.map((token) => ({
      token,
      queried: 0,
      total: BigInt(0),
    }))

    wallets.forEach((wallet) => {
      const state = balances[wallet.address]
      if (!state) return
      if (state.nativeRaw) {
        nativeQueried += 1
        nativeTotal += BigInt(state.nativeRaw)
      }
      tokenTotals.forEach((item) => {
        const tokenState = state.tokens[item.token.id]
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

  const deriveIntoState = (
    phrase: string,
    chainId: string,
    nextVariantId: string,
    showSuccess: boolean
  ) => {
    const count = parseCount(countInput)
    if (count == null) {
      toast.error(`派生数量需要是 ${MIN_DERIVE_COUNT} 到 ${MAX_DERIVE_COUNT} 的整数`)
      return false
    }
    try {
      const nextWallets = derive(phrase, count, { chainId, variantId: nextVariantId })
      clearQueryState()
      setWallets(nextWallets)
      setDerivedMnemonic(normalizeMnemonic(phrase))
      setMnemonic(normalizeMnemonic(phrase))
      if (showSuccess) toast.success(`已生成 ${nextWallets.length} 个地址`)
      return true
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '生成地址失败')
      return false
    }
  }

  const handleGenerate = (wordCount: 12 | 24) => {
    const phrase = createMnemonic(wordCount)
    setMnemonic(phrase)
    deriveIntoState(phrase, selectedChainId, variantId, true)
  }

  const handleClear = () => {
    clearQueryState()
    setMnemonic('')
    setDerivedMnemonic('')
    setWallets([])
    setTokens([])
    setTokenInput('')
  }

  const handleSelectChain = (chainId: string) => {
    if (chainId === selectedChainId) return
    const hadTokens = tokens.length > 0
    clearQueryState()
    setSelectedChainId(chainId)
    setTokens([])
    if (hadTokens && supportsTokens) toast('已切换网络，请重新添加当前链的代币')
    if (rederiveOnChainChange && derivedMnemonic && !deriveIntoState(derivedMnemonic, chainId, variantId, false)) {
      setWallets([])
    }
  }

  const handleSelectVariant = (nextVariantId: string) => {
    if (nextVariantId === variantId) return
    setVariantId(nextVariantId)
    clearQueryState()
    if (derivedMnemonic && !deriveIntoState(derivedMnemonic, selectedChainId, nextVariantId, false)) {
      setWallets([])
    }
  }

  const handleAddToken = async () => {
    if (!readToken) return
    const epoch = epochRef.current
    setAddingToken(true)
    try {
      const token = await readToken(selectedChainId, tokenInput)
      if (epochRef.current !== epoch) return
      if (tokens.some((item) => item.id === token.id)) {
        toast.error('该代币已添加')
        return
      }
      setTokens((prev) => (prev.some((item) => item.id === token.id) ? prev : [...prev, token]))
      setTokenInput('')
      toast.success(`已添加 ${token.symbol}`)
    } catch (error) {
      if (epochRef.current === epoch) {
        toast.error(error instanceof Error ? error.message : '读取代币信息失败，请确认当前网络和合约地址')
      }
    } finally {
      if (epochRef.current === epoch) setAddingToken(false)
    }
  }

  const removeToken = (tokenId: string) => {
    setTokens((prev) => prev.filter((token) => token.id !== tokenId))
    setBalances((prev) => {
      const next: Record<string, IAddressBalanceState> = {}
      Object.entries(prev).forEach(([walletKey, state]) => {
        const tokenMap = { ...state.tokens }
        delete tokenMap[tokenId]
        next[walletKey] = { ...state, tokens: tokenMap }
      })
      return next
    })
  }

  const queryNative = async (wallet: IDerivedAccount) => {
    const epoch = epochRef.current
    const key = wallet.address
    setNativeLoading((prev) => ({ ...prev, [key]: true }))
    try {
      const value = await getNativeBalance(selectedChainId, wallet.address)
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

  const queryTokens = async (wallet: IDerivedAccount) => {
    if (!getTokenBalance) return
    if (tokens.length === 0) {
      toast.error('请先添加代币')
      return
    }
    const epoch = epochRef.current
    const key = wallet.address
    const tokenList = tokens
    const chainId = selectedChainId
    setTokenLoading((prev) => ({ ...prev, [key]: true }))
    try {
      const results = await Promise.all(
        tokenList.map(async (token) => {
          try {
            const value = await getTokenBalance(chainId, wallet.address, token)
            return { id: token.id, raw: value.toString() }
          } catch {
            return { id: token.id, error: '查询失败' }
          }
        })
      )
      if (epochRef.current !== epoch) return
      setBalances((prev) => {
        const current = prev[key] ?? { tokens: {} }
        const tokenMap = { ...current.tokens }
        results.forEach((item) => {
          tokenMap[item.id] = item.raw ? { raw: item.raw } : { error: item.error }
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
    const walletList = wallets
    const tokenList = tokens
    const chainId = selectedChainId
    setBatchLoading(true)
    try {
      const nativeResults = await mapPool(walletList, 6, async (wallet) => {
        try {
          const value = await getNativeBalance(chainId, wallet.address)
          return { address: wallet.address, raw: value.toString(), error: undefined }
        } catch {
          return { address: wallet.address, raw: undefined, error: '查询失败' }
        }
      })
      if (epochRef.current !== epoch) return

      const tokenResults = supportsTokens && tokenList.length > 0
        ? await queryAllTokens(chainId, walletList, tokenList)
        : []
      if (epochRef.current !== epoch) return

      const next: Record<string, IAddressBalanceState> = {}
      nativeResults.forEach((item) => {
        next[item.address] = {
          tokens: {},
          nativeRaw: item.raw,
          nativeError: item.error,
        }
      })
      tokenResults.forEach((item) => {
        const current = next[item.wallet] ?? { tokens: {} }
        current.tokens[item.token] = item.raw ? { raw: item.raw } : { error: item.error || '查询失败' }
        next[item.wallet] = current
      })
      setBalances(next)

      const hasFailure = nativeResults.some((item) => item.error) || tokenResults.some((item) => item.error)
      if (hasFailure) toast.error('部分余额查询失败')
      else toast.success('余额查询完成')
    } finally {
      if (epochRef.current === epoch) setBatchLoading(false)
    }
  }

  const queryAllTokens = async (chainId: string, walletList: IDerivedAccount[], tokenList: IWatchToken[]) => {
    if (getTokenBalances) return getTokenBalances(chainId, walletList, tokenList)
    if (!getTokenBalance) return []
    const jobs = walletList.flatMap((wallet) => tokenList.map((token) => ({ wallet, token })))
    return mapPool(jobs, 4, async ({ wallet, token }) => {
      try {
        const value = await getTokenBalance!(chainId, wallet.address, token)
        return { wallet: wallet.address, token: token.id, raw: value.toString() }
      } catch {
        return { wallet: wallet.address, token: token.id, error: '查询失败' }
      }
    })
  }

  return (
    <ToolWrapper>
      <PageHeader>
        <PageTitle>{title}</PageTitle>
        <PageSubtitle>{subtitle}</PageSubtitle>
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
        {variants.length > 0 && (
          <ChainRow>
            <FieldLabel htmlFor="wallet-variant">{variantLabel}</FieldLabel>
            <SelectWrap>
              <ChainSelect
                id="wallet-variant"
                value={variantId}
                onChange={(event) => handleSelectVariant(event.target.value)}
              >
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name}
                  </option>
                ))}
              </ChainSelect>
              <SelectArrow>▼</SelectArrow>
            </SelectWrap>
          </ChainRow>
        )}
        <DeriveRow>
          <CountField>
            <FieldLabel htmlFor="derive-count">派生数量</FieldLabel>
            <CountInput
              id="derive-count"
              inputMode="numeric"
              value={countInput}
              onChange={(event) => setCountInput(event.target.value.replace(/[^\d]/g, ''))}
              onKeyDown={(event) => {
                if (event.key === 'Enter') deriveIntoState(mnemonic, selectedChainId, variantId, true)
              }}
            />
          </CountField>
          <PrimaryButton type="button" onClick={() => deriveIntoState(mnemonic, selectedChainId, variantId, true)}>
            生成地址
          </PrimaryButton>
        </DeriveRow>
        <Hint>{hint}</Hint>
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
              onChange={(event) => handleSelectChain(event.target.value)}
            >
              <optgroup label="主网">
                {mainnetChains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name} ({chain.symbol})
                  </option>
                ))}
              </optgroup>
              {testnetChains.length > 0 && (
                <optgroup label="测试网">
                  {testnetChains.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.name} ({chain.symbol})
                    </option>
                  ))}
                </optgroup>
              )}
            </ChainSelect>
            <SelectArrow>▼</SelectArrow>
          </SelectWrap>
          {selectedChain.meta && <ChainMeta>{selectedChain.meta}</ChainMeta>}
        </ChainRow>

        {supportsTokens && (
          <>
            <FieldLabel htmlFor="token-address">添加代币</FieldLabel>
            <ActionRow>
              <TokenInput
                id="token-address"
                value={tokenInput}
                placeholder={tokenPlaceholder}
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
                  <TokenItem key={token.id}>
                    <TokenMain>
                      <strong>
                        {token.symbol} · decimals {token.decimals}
                      </strong>
                      <span>{token.address}</span>
                    </TokenMain>
                    <GhostButton type="button" onClick={() => removeToken(token.id)}>
                      移除
                    </GhostButton>
                  </TokenItem>
                ))}
              </TokenList>
            )}
            <Hint>{tokenHint}</Hint>
          </>
        )}

        <PrimaryButton type="button" disabled={batchLoading || wallets.length === 0} onClick={queryAll}>
          {batchLoading ? '查询中...' : '一键查询余额'}
        </PrimaryButton>
        {summary && (
          <SummaryBox>
            {summary.nativeQueried > 0 && (
              <div>
                {nativeSymbol} 合计 {formatTokenAmount(summary.nativeTotal, selectedChain.decimals)}（
                {summary.nativeQueried}/{wallets.length}）
              </div>
            )}
            {summary.tokenTotals
              .filter((item) => item.queried > 0)
              .map((item) => (
                <div key={item.token.id}>
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
              const state = balances[wallet.address]
              const explorerUrl = getExplorerUrl(selectedChainId, wallet.address)
              const nativeText = state?.nativeError
                ? state.nativeError
                : state?.nativeRaw
                  ? `${formatTokenAmount(BigInt(state.nativeRaw), selectedChain.decimals)} ${nativeSymbol}`
                  : batchLoading
                    ? '查询中...'
                    : '未查询'
              return (
                <AccountCard key={`${wallet.path}-${wallet.address}`}>
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
                      const tokenState = state?.tokens[token.id]
                      const text = tokenState?.error
                        ? tokenState.error
                        : tokenState?.raw
                          ? formatTokenAmount(BigInt(tokenState.raw), token.decimals)
                          : batchLoading || tokenLoading[wallet.address]
                            ? '查询中...'
                            : '未查询'
                      return (
                        <BalanceLine key={token.id}>
                          <BalanceSymbol>{token.symbol}</BalanceSymbol>
                          <BalanceAmount $error={!!tokenState?.error}>{text}</BalanceAmount>
                        </BalanceLine>
                      )
                    })}
                  </BalanceList>
                  <ActionRow>
                    <SecondaryButton
                      type="button"
                      disabled={batchLoading || nativeLoading[wallet.address]}
                      onClick={() => queryNative(wallet)}
                    >
                      {nativeLoading[wallet.address] ? '查询中...' : `查询${nativeSymbol}余额`}
                    </SecondaryButton>
                    {supportsTokens && (
                      <SecondaryButton
                        type="button"
                        disabled={batchLoading || tokenLoading[wallet.address]}
                        onClick={() => queryTokens(wallet)}
                      >
                        {tokenLoading[wallet.address] ? '查询中...' : '查询代币余额'}
                      </SecondaryButton>
                    )}
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
