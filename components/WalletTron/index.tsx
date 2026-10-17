'use client'

import ChainWallet from '@/components/ChainWallet'
import {
  TRON_NETWORKS,
  deriveTronWallets,
  getTronBalance,
  getTronExplorerUrl,
  getTronTokenBalance,
  readTronToken,
} from '@/utils/walletTron'

export default function WalletTron() {
  return (
    <ChainWallet
      title="区块链钱包生成（Tron）"
      subtitle="在浏览器内生成或导入助记词，按 TronLink 使用的路径派生 Tron 地址，并查询 TRX 和 TRC20 余额。私钥以十六进制明文显示，数据只留在当前页面内存中。"
      pathHint="派生路径为 m/44'/195'/0'/0/index，与 TronLink 一致。数量范围 1 到 100。"
      chains={TRON_NETWORKS.map((network) => ({
        id: network.id,
        name: network.name,
        symbol: network.symbol,
        decimals: network.decimals,
        isTestnet: network.isTestnet,
        meta: network.name,
      }))}
      defaultChainId="mainnet"
      derive={(mnemonic, count) => deriveTronWallets(mnemonic, count)}
      getExplorerUrl={getTronExplorerUrl}
      getNativeBalance={getTronBalance}
      readToken={readTronToken}
      getTokenBalance={(chainId, owner, token) => getTronTokenBalance(chainId, owner, token.address)}
      tokenPlaceholder="TRC20 合约地址，例如 TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
      tokenHint="代币需要是当前网络上的 TRC20 合约。切换网络后会清空已添加的代币。"
    />
  )
}
