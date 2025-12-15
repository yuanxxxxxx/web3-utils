# API 与工具函数

## API 请求

### 基础配置

```typescript
// request/index.ts
import { httpClient } from '@/request'

// 自动添加 Bearer Token
// 自动处理 401（登出）、400（参数错误）等
```

### 认证相关 API

```typescript
import { getNonce, login, getProfile } from '@/request'

// 1. 获取 Nonce
const { nonce } = await getNonce('0xYourAddress')

// 2. SIWE 登录
const { accessToken, user } = await login(message, signature)

// 3. 获取用户信息
const userInfo = await getProfile()
```

### 自定义 API

```typescript
// request/index.ts
export const getMyData = async () => {
  return httpClient.get('/my-endpoint')
}

export const postData = async (data: any) => {
  return httpClient.post('/my-endpoint', data)
}

// 使用
import { getMyData } from '@/request'

const data = await getMyData()
```

### 错误处理

```typescript
// 已自动处理的错误码
// 401: 自动登出 + 提示 "Login expired"
// 400: 提示 "Invalid parameters"
// 403: 提示 "No permission"
// 404: 提示 "Resource not found"
// 500: 提示 "Server error"

// 自定义错误处理
try {
  const data = await getMyData()
} catch (error) {
  // 错误已被拦截器处理并显示 toast
  console.error(error)
}
```

---

## 工具函数

### 地址格式化

```typescript
import { toFormatAccount } from '@/utils/format'

// 默认：前6位 + ... + 后6位
toFormatAccount('0x1234567890abcdef1234567890abcdef12345678')
// => '0x1234...345678'

// 自定义长度
toFormatAccount('0x1234567890abcdef1234567890abcdef12345678', 4, 4)
// => '0x12...5678'
```

### 金额转换

```typescript
import { fromValue, toValue } from '@/utils/format'

// Wei -> ETH (带小数)
fromValue('1000000000000000000', 18, 4)
// => '1.0000'

fromValue('1234567890000000000', 18, 2)
// => '1.23'

// ETH -> Wei
toValue('1.5', 18)
// => '1500000000000000000'

toValue('100', 6) // USDT 6位小数
// => '100000000'
```

### 数字格式化

```typescript
import { convertToShortScale, unitsBefore } from '@/utils/format'

// 大数缩写
convertToShortScale(1000)        // => '1.00k'
convertToShortScale(1500000)     // => '1.50M'
convertToShortScale(1000000000)  // => '1.00B'

// 极小数处理
convertToShortScale(0.00000123)  // => '0.0{5}1'

// 添加 +/- 符号
unitsBefore(100)   // => '+100'
unitsBefore(-50)   // => '-50'
unitsBefore(0)     // => '0'
```

---

## Redux 状态管理

### User State

```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setEvmAddress, setLoginToken, setUserInfo } from '@/store/userSlice'

// 读取状态
const { evmAddress, loginToken, userInfo } = useAppSelector(state => state.user)

// 更新状态
const dispatch = useAppDispatch()
dispatch(setEvmAddress('0x...'))
dispatch(setLoginToken('token...'))
dispatch(setUserInfo({ ... }))
```

### App State

```typescript
import { setLanguage, setTheme } from '@/store/appSlice'

// 读取
const { language, theme } = useAppSelector(state => state.app)

// 更新
dispatch(setLanguage(LANGUAGE_ENUM.zh))
dispatch(setTheme(THEME_ENUM.dark))
```

---

## 国际化 (i18n)

### 配置文件

```json
// lib/locales/zh.json
{
  "welcome": "欢迎",
  "connect": "连接钱包"
}

// lib/locales/en.json
{
  "welcome": "Welcome",
  "connect": "Connect Wallet"
}
```

### 使用翻译

```tsx
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()

<button>{t('connect')}</button>
```

### 切换语言

```tsx
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/store/hooks'
import { setLanguage } from '@/store/appSlice'
import { LANGUAGE_ENUM } from '@/types'

const { i18n } = useTranslation()
const dispatch = useAppDispatch()

const switchLanguage = (lang: LANGUAGE_ENUM) => {
  i18n.changeLanguage(lang)
  dispatch(setLanguage(lang))
  localStorage.setItem('LANGUAGE_LOCAL_KEY', lang)
}
```

---

## 其他工具 API

### 获取 ETH 价格

```typescript
import { getCoinbaseTokenPrice } from '@/request'

const { data } = await getCoinbaseTokenPrice('ETH')
const price = data.data.amount // USD 价格
```

### 上传文件到 IPFS (Pinata)

```typescript
import { pinataUploadFile } from '@/request'

const file: File = ... // 来自 input[type="file"]

const { data } = await pinataUploadFile(file)
const ipfsHash = data.IpfsHash
const fileUrl = `${WEBSITE_CONFIG.pinadaConfig.fileUrl}${ipfsHash}`
```

---

## LocalStorage Keys

```typescript
// 定义在 types/constant.ts
export const LOGIN_TOKEN_LOCAL_KEY = "LOGIN_TOKEN_LOCAL_KEY"
export const LANGUAGE_LOCAL_KEY = "LANGUAGE_LOCAL_KEY"
export const THEME_LOCAL_KEY = "THEME_LOCAL_KEY"

// 使用
localStorage.getItem(LOGIN_TOKEN_LOCAL_KEY)
localStorage.setItem(THEME_LOCAL_KEY, 'dark')
```

---

## 完整示例

```tsx
'use client'

import { useState, useEffect } from 'react'
import useActiveWeb3React from '@/hooks/useActiveWeb3React'
import { useReadContracts } from 'wagmi'
import { erc20Abi } from 'viem'
import { fromValue, toFormatAccount } from '@/utils/format'
import { getMyData } from '@/request'
import toast from 'react-hot-toast'

export default function DataPage() {
  const { account } = useActiveWeb3React()
  const [apiData, setApiData] = useState(null)
  
  // 读取链上数据
  const { data } = useReadContracts({
    contracts: [{
      address: '0xTokenAddress',
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account as `0x${string}`]
    }],
    query: { enabled: !!account }
  })
  
  const balance = data?.[0]?.result as bigint
  
  // 获取 API 数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMyData()
        setApiData(result)
      } catch (error) {
        toast.error('Failed to load data')
      }
    }
    fetchData()
  }, [])
  
  return (
    <div>
      <p>Address: {toFormatAccount(account)}</p>
      <p>Balance: {fromValue(balance?.toString() || '0', 18, 4)} ETH</p>
      <pre>{JSON.stringify(apiData, null, 2)}</pre>
    </div>
  )
}
```

