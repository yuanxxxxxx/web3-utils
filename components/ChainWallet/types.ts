export interface IChainOption {
  id: string
  name: string
  symbol: string
  decimals: number
  isTestnet?: boolean
  meta?: string
}

export interface IWalletVariant {
  id: string
  name: string
}

export interface IDerivedAccount {
  index: number
  path: string
  address: string
  privateKey: string
}

export interface IWatchToken {
  id: string
  address: string
  symbol: string
  decimals: number
}

export interface ITokenBalanceResult {
  wallet: string
  token: string
  raw?: string
  error?: string
}

export interface IDeriveContext {
  chainId: string
  variantId?: string
}

export interface ChainWalletProps {
  title: string
  subtitle: string
  pathHint: string | ((context: IDeriveContext) => string)
  chains: IChainOption[]
  defaultChainId: string
  derive: (mnemonic: string, count: number, context: IDeriveContext) => IDerivedAccount[]
  getExplorerUrl: (chainId: string, address: string) => string
  getNativeBalance: (chainId: string, address: string) => Promise<bigint>
  supportsTokens?: boolean
  tokenPlaceholder?: string
  tokenHint?: string
  variants?: IWalletVariant[]
  defaultVariantId?: string
  variantLabel?: string
  rederiveOnChainChange?: boolean
  readToken?: (chainId: string, input: string) => Promise<IWatchToken>
  getTokenBalance?: (chainId: string, owner: string, token: IWatchToken) => Promise<bigint>
  getTokenBalances?: (
    chainId: string,
    wallets: IDerivedAccount[],
    tokens: IWatchToken[]
  ) => Promise<ITokenBalanceResult[]>
}
