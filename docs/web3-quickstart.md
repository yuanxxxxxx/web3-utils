# Web3 钱包快速开始

## 第一步：获取 WalletConnect Project ID

1. 访问 https://cloud.walletconnect.com
2. 注册或登录
3. 点击 "Create New Project"
4. 输入项目名称（例如：Next App）
5. 复制生成的 Project ID

## 第二步：配置环境变量

根据你的开发环境，编辑相应的环境配置文件：

### 测试环境（推荐用于开发）

编辑 `.env.test` 文件：

```bash
# 找到这一行并替换为你的 Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

### 生产环境

编辑 `.env.production` 文件：

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

## 第三步：运行项目

```bash
# 测试环境
yarn dev:test

# 生产环境
yarn dev:prod
```

## 第四步：测试钱包连接

1. 打开浏览器访问 http://localhost:3000
2. 点击右上角的 "Connect Wallet" 按钮
3. 选择你的钱包（推荐使用 MetaMask）
4. 完成连接授权
5. 访问 http://localhost:3000/wallet 查看钱包信息

## 功能特性

### ✅ 已实现功能

- 🔌 钱包连接/断开
- 🌐 多链支持（Ethereum、Polygon、Optimism、Arbitrum、Base）
- 💰 余额查询
- 📱 支持多种钱包（MetaMask、WalletConnect、Coinbase Wallet 等）
- 🎨 美观的 UI 界面
- 📊 实时显示钱包信息

### 🔧 可扩展功能

你可以基于现有配置轻松实现：

- 合约交互（读取/写入）
- 代币转账
- NFT 展示
- 交易历史
- 签名消息
- ENS 域名解析

## 常用代码示例

### 获取钱包地址

```typescript
import { useAccount } from 'wagmi'

const { address, isConnected } = useAccount()
```

### 获取余额

```typescript
import { useBalance } from 'wagmi'

const { data: balance } = useBalance({
  address: userAddress,
})
```

### 切换网络

```typescript
import { useSwitchChain } from 'wagmi'

const { switchChain } = useSwitchChain()
switchChain({ chainId: 137 }) // 切换到 Polygon
```

## 支持的区块链网络

当前配置支持以下网络：

| 网络 | Chain ID | 说明 |
|------|----------|------|
| Ethereum Mainnet | 1 | 以太坊主网 |
| Polygon | 137 | Polygon 主网 |
| Optimism | 10 | Optimism 主网 |
| Arbitrum | 42161 | Arbitrum One |
| Base | 8453 | Base 主网 |

如需添加其他网络，编辑 `lib/web3/config.ts` 文件。

## 故障排查

### 问题：点击 Connect Wallet 无反应

**解决方案：**
- 确保已安装 MetaMask 或其他 Web3 钱包插件
- 检查浏览器控制台是否有错误信息
- 验证 Project ID 是否正确配置

### 问题：连接后刷新页面断开

**解决方案：**
- 检查 `lib/web3/config.ts` 中是否启用了 `ssr: true`
- 确保 Web3Provider 在 layout.tsx 中正确配置

### 问题：无法显示余额

**解决方案：**
- 确保钱包已连接
- 检查当前网络是否有余额
- 验证 RPC 节点是否可用

## 相关文档

- [完整 Web3 集成指南](./web3-guide.md)
- [RainbowKit 官方文档](https://www.rainbowkit.com)
- [Wagmi 官方文档](https://wagmi.sh)

## 需要帮助？

如遇到问题，请查看：
1. 浏览器控制台错误信息
2. [WalletConnect Cloud](https://cloud.walletconnect.com) 项目状态
3. 确认网络连接正常
