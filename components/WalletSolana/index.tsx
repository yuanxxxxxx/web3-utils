'use client'

import ChainWallet from '@/components/ChainWallet'
import {
  SOLANA_NETWORKS,
  deriveSolanaWallets,
  getSolanaBalance,
  getSolanaExplorerUrl,
  getSolanaTokenBalance,
  readSolanaToken,
} from '@/utils/walletSolana'

export default function WalletSolana() {
  return (
    <ChainWallet
      title="区块链钱包生成（Solana）"
      subtitle="在浏览器内生成或导入助记词，按 Phantom 使用的路径派生 Solana 地址，并查询 SOL 和 SPL 代币余额。私钥以 Base58 明文显示，数据只留在当前页面内存中。"
      pathHint="派生路径为 m/44'/501'/index'/0'，与 Phantom、Solflare 一致。数量范围 1 到 100。"
      chains={SOLANA_NETWORKS.map((network) => ({
        id: network.id,
        name: network.name,
        symbol: network.symbol,
        decimals: network.decimals,
        isTestnet: network.isTestnet,
        meta: network.name,
      }))}
      defaultChainId="mainnet"
      derive={(mnemonic, count) => deriveSolanaWallets(mnemonic, count)}
      getExplorerUrl={getSolanaExplorerUrl}
      getNativeBalance={getSolanaBalance}
      readToken={readSolanaToken}
      getTokenBalance={(chainId, owner, token) => getSolanaTokenBalance(chainId, owner, token.address)}
      tokenPlaceholder="SPL 代币 Mint 地址，例如 EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      tokenHint="填写当前网络上的 Mint 地址。切换网络后会清空已添加的代币。"
    />
  )
}
