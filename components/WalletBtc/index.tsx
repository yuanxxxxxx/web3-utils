'use client'

import ChainWallet from '@/components/ChainWallet'
import {
  BTC_FORMATS,
  BTC_NETWORKS,
  deriveBtcWallets,
  getBtcBalance,
  getBtcExplorerUrl,
  getBtcFormat,
} from '@/utils/walletBtc'

export default function WalletBtc() {
  return (
    <ChainWallet
      title="区块链钱包生成（BTC）"
      subtitle="在浏览器内生成或导入助记词，按比特币标准路径派生地址，并查询 BTC 余额。私钥以 WIF 明文显示，数据只留在当前页面内存中。"
      pathHint={({ variantId }) => {
        const format = getBtcFormat(variantId)
        return `派生路径为 m/${format.purpose}'/coin'/0'/0/index。主网 coin 为 0，测试网为 1。数量范围 1 到 100。`
      }}
      chains={BTC_NETWORKS.map((network) => ({
        id: network.id,
        name: network.name,
        symbol: network.symbol,
        decimals: network.decimals,
        isTestnet: network.isTestnet,
        meta: network.name,
      }))}
      defaultChainId="mainnet"
      variants={BTC_FORMATS.map((format) => ({
        id: format.id,
        name: format.name,
      }))}
      defaultVariantId="native"
      variantLabel="地址类型"
      rederiveOnChainChange
      supportsTokens={false}
      derive={(mnemonic, count, context) => deriveBtcWallets(mnemonic, count, context.chainId, context.variantId)}
      getExplorerUrl={getBtcExplorerUrl}
      getNativeBalance={getBtcBalance}
    />
  )
}
