# Web3 钱包集成指南

本项目已集成 RainbowKit 和 Wagmi，提供完整的 Web3 钱包连接功能。

## 已安装依赖

- `@rainbow-me/rainbowkit`: ^2.2.10
- `wagmi`: ^3.1.0
- `viem`: ^2.41.2
- `@tanstack/react-query`: ^5.90.12

## 配置步骤

### 1. 获取 WalletConnect Project ID

1. 访问 [WalletConnect Cloud](https://cloud.walletconnect.com)
2. 注册或登录账号
3. 创建新项目
4. 复制 Project ID

### 2. 配置环境变量

在相应的环境配置文件中设置 Project ID：

- `.env.test` - 测试环境
- `.env.production` - 生产环境
- `.env.example` - 示例文件

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 3. 配置支持的区块链网络

在 `lib/web3/config.ts` 中配置支持的区块链网络：

```typescript
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Next App',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
})
```

你可以根据需要添加或删除支持的网络。

## 项目结构

```
lib/web3/
├── config.ts          # Wagmi 配置
└── Web3Provider.tsx   # Web3 Provider 组件
```

## 使用钱包功能

### 连接钱包

钱包连接按钮已经集成在 Header 组件的最右边。用户可以：

1. 点击 "Connect Wallet" 按钮
2. 选择喜欢的钱包（MetaMask、WalletConnect、Coinbase Wallet 等）
3. 完成连接

### 在组件中使用 Wagmi Hooks

```typescript
'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function MyComponent() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <button onClick={() => connect()}>Connect Wallet</button>
      )}
    </div>
  )
}
```

### 读取合约数据

```typescript
import { useReadContract } from 'wagmi'

export default function ContractReader() {
  const { data, isLoading } = useReadContract({
    address: '0x...', // 合约地址
    abi: contractABI,
    functionName: 'balanceOf',
    args: [address],
  })

  return <div>Balance: {data?.toString()}</div>
}
```

### 写入合约数据

```typescript
import { useWriteContract } from 'wagmi'

export default function ContractWriter() {
  const { writeContract, isPending } = useWriteContract()

  const handleTransfer = () => {
    writeContract({
      address: '0x...', // 合约地址
      abi: contractABI,
      functionName: 'transfer',
      args: [recipientAddress, amount],
    })
  }

  return (
    <button onClick={handleTransfer} disabled={isPending}>
      {isPending ? 'Processing...' : 'Transfer'}
    </button>
  )
}
```

## RainbowKit 自定义

### 自定义主题

你可以在 `lib/web3/Web3Provider.tsx` 中自定义 RainbowKit 主题：

```typescript
import { darkTheme, lightTheme } from '@rainbow-me/rainbowkit'

<RainbowKitProvider theme={darkTheme()}>
  {children}
</RainbowKitProvider>
```

### 自定义钱包列表

在 `lib/web3/config.ts` 中可以自定义显示的钱包：

```typescript
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [metaMaskWallet, coinbaseWallet, walletConnectWallet],
  },
])
```

## 常见问题

### 1. 钱包连接后刷新页面断开

确保在配置中启用了 SSR：

```typescript
export const config = getDefaultConfig({
  // ...
  ssr: true,
})
```

### 2. WalletConnect 连接失败

- 检查 Project ID 是否正确配置
- 确保 Project ID 在 WalletConnect Cloud 中是激活状态
- 检查网络连接

### 3. 切换网络

使用 `useSwitchChain` hook：

```typescript
import { useSwitchChain } from 'wagmi'

const { switchChain } = useSwitchChain()

// 切换到 Polygon
switchChain({ chainId: 137 })
```

## 相关资源

- [RainbowKit 文档](https://www.rainbowkit.com/docs/introduction)
- [Wagmi 文档](https://wagmi.sh)
- [Viem 文档](https://viem.sh)
- [WalletConnect Cloud](https://cloud.walletconnect.com)
