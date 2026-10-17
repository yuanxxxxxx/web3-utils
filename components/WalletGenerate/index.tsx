'use client'

import ChainWallet from '@/components/ChainWallet'
import {
  EVM_CHAIN_OPTIONS,
  deriveEvmWallets,
  getEvmBalance,
  getEvmExplorerUrl,
  getEvmTokenBalance,
  getEvmTokenBalances,
  readEvmToken,
} from './evm'

export default function WalletGenerate() {
  return (
    <ChainWallet
      title="区块链钱包生成（EVM）"
      subtitle="在浏览器内生成或导入助记词，按 BIP44 路径派生 EVM 地址，并查询原生币和代币余额。数据只留在当前页面内存中，刷新后即消失。"
      pathHint="派生路径为 m/44'/60'/0'/0/index，与 MetaMask 等 EVM 钱包一致。数量范围 1 到 100。"
      chains={EVM_CHAIN_OPTIONS}
      defaultChainId={EVM_CHAIN_OPTIONS[0].id}
      derive={(mnemonic, count) => deriveEvmWallets(mnemonic, count)}
      getExplorerUrl={getEvmExplorerUrl}
      getNativeBalance={getEvmBalance}
      readToken={readEvmToken}
      getTokenBalance={getEvmTokenBalance}
      getTokenBalances={getEvmTokenBalances}
      tokenPlaceholder="代币合约地址，例如 0xdAC17F958D2ee523a2206206994597C13D831ec7"
      tokenHint="代币需要是当前网络上的合约。切换网络后会清空已添加的代币。"
    />
  )
}
