# 开发规范

## 📋 代码规范

### TypeScript 规范

#### 类型定义

```typescript
// ✅ 推荐 - 使用 interface 定义对象类型
interface User {
  id: string
  name: string
  email: string
}

// ✅ 推荐 - 使用 type 定义联合类型
type Status = 'pending' | 'success' | 'error'

// ❌ 避免使用 any
const data: any = getData() // 不推荐

// ✅ 使用具体类型或 unknown
const data: User = getData()
const data: unknown = getData()
```

#### 函数类型

```typescript
// ✅ 推荐 - 明确的参数和返回类型
function getUserById(id: string): User | null {
  // ...
}

// ✅ 推荐 - 箭头函数
const fetchUser = async (id: string): Promise<User> => {
  // ...
}

// ❌ 避免 - 隐式 any
function processData(data) {
  // ...
}
```

#### 可选属性和必填属性

```typescript
interface UserProfile {
  id: string          // 必填
  name: string        // 必填
  avatar?: string     // 可选
  bio?: string        // 可选
}

// 使用 Required 工具类型使所有属性必填
type RequiredProfile = Required<UserProfile>

// 使用 Partial 工具类型使所有属性可选
type PartialProfile = Partial<UserProfile>
```

### React 规范

#### 组件结构规范

**所有组件必须遵循文件夹结构**:
```
components/
└── ComponentName/
    ├── index.tsx    # 组件逻辑、Props、状态、事件处理
    └── style.ts     # 所有 styled-components 样式定义
```

#### style.ts - 样式文件

```typescript
// components/Button/style.ts
import styled from 'styled-components'

export const StyledButton = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.$primary ? '#0070f3' : '#eaeaea'};
  color: ${props => props.$primary ? 'white' : '#333'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`
```

#### index.tsx - 组件逻辑

```typescript
// components/Button/index.tsx
'use client'

import { StyledButton } from './style'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  primary?: boolean
}

export default function Button({ children, onClick, disabled, primary }: ButtonProps) {
  return (
    <StyledButton onClick={onClick} disabled={disabled} $primary={primary}>
      {children}
    </StyledButton>
  )
}
```

**规范要点**:
- ✅ 样式组件全部在 style.ts 中定义并 export
- ✅ 组件逻辑在 index.tsx 中实现
- ✅ 从 './style' 导入需要的样式组件
- ✅ Props 传递给 DOM 的属性使用 $ 前缀（如 $primary）

#### Hooks 使用

```typescript
// ✅ 推荐 - 在组件顶层调用 hooks
function MyComponent() {
  const [count, setCount] = useState(0)
  const user = useAppSelector(state => state.user)
  
  useEffect(() => {
    // ...
  }, [count])
  
  return <div>{count}</div>
}

// ❌ 避免 - 条件调用 hooks
function MyComponent({ condition }) {
  if (condition) {
    const [count, setCount] = useState(0) // ❌
  }
}
```

#### 组件 Props 解构

```typescript
// ✅ 推荐 - 在参数中解构
function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}

// ❌ 不推荐 - 在函数体内解构
function Button(props: ButtonProps) {
  const { label, onClick } = props
  return <button onClick={onClick}>{label}</button>
}
```

### 文件组织规范

#### 组件文件结构

```
components/
└── ComponentName/
    ├── index.tsx    # 组件入口
    └── style.ts     # 样式定义
```

#### 导入顺序

**在 style.ts 中**:
```typescript
// 1. styled-components 库
import styled from 'styled-components'

// 2. 其他依赖（如 Link 等）
import Link from 'next/link'

// 3. 导出所有样式组件
export const Container = styled.div``
export const Title = styled.h1``
```

**在 index.tsx 中**:
```typescript
// 1. React 相关
import { useState, useEffect } from 'react'

// 2. 第三方库
import Link from 'next/link'

// 3. 内部模块
import { useAppSelector, useAppDispatch } from '@/store/hooks'

// 4. 其他组件
import Header from '@/components/Header'
import Button from '@/components/Button'

// 5. 本地样式组件
import { Container, Title, Button as StyledButton } from './style'

// 6. 类型定义
import type { User } from '@/types'
```

#### 导出规范

```typescript
// ✅ 推荐 - 默认导出用于主要组件
export default function MyComponent() {
  // ...
}

// ✅ 推荐 - 命名导出用于工具函数和常量
export const formatDate = (date: Date) => {
  // ...
}

export const API_URL = 'https://api.example.com'

// ❌ 避免 - 混合使用可能造成混淆
export default MyComponent
export { MyComponent } // 不必要的重复
```

## 🎨 命名规范

### 文件命名

| 类型 | 命名方式 | 示例 |
|------|---------|------|
| 组件文件夹 | PascalCase | `UserProfile/` |
| 组件入口 | 固定 | `index.tsx` |
| 组件样式 | 固定 | `style.ts` |
| 工具函数 | camelCase | `formatDate.ts` |
| Hooks | camelCase, use 前缀 | `useAuth.ts` |
| 类型定义 | camelCase | `types.ts` |
| 常量 | camelCase | `constants.ts` |

### 组件结构示例

```
✅ 正确
components/
├── UserProfile/
│   ├── index.tsx
│   └── style.ts
├── Button/
│   ├── index.tsx
│   └── style.ts
└── Header/
    ├── index.tsx
    └── style.ts

❌ 错误
components/
├── UserProfile.tsx
├── Button.tsx
└── Header.tsx
```

### 变量命名

```typescript
// ✅ 推荐 - camelCase
const userName = 'John'
const isLoggedIn = true
const userCount = 10

// ✅ 推荐 - 布尔值使用 is/has/should 前缀
const isLoading = false
const hasPermission = true
const shouldUpdate = true

// ✅ 推荐 - 常量使用 UPPER_CASE
const API_URL = 'https://api.example.com'
const MAX_RETRY_COUNT = 3

// ❌ 避免 - 不清晰的命名
const data = {}
const temp = 'value'
const x = 10
```

### 函数命名

```typescript
// ✅ 推荐 - 使用动词开头
function getUser() {}
function setUserName() {}
function updateProfile() {}
function deleteComment() {}
function validateEmail() {}

// ✅ 推荐 - 事件处理函数使用 handle 前缀
function handleClick() {}
function handleSubmit() {}
function handleChange() {}

// ✅ 推荐 - 回调函数使用 on 前缀
interface Props {
  onClick?: () => void
  onSubmit?: (data: FormData) => void
  onChange?: (value: string) => void
}
```

### 组件命名

```typescript
// ✅ 推荐 - 文件夹使用 PascalCase
components/UserProfile/
components/NavigationBar/
components/TodoList/

// ✅ 推荐 - 具有描述性
components/SubmitButton/
components/UserAvatar/

// ❌ 避免 - 过于通用
components/Component1/
components/MyComponent/
```

### 样式组件命名

```typescript
// ✅ 推荐 - 在 style.ts 中使用清晰的名称
export const Container = styled.div``
export const Title = styled.h1``
export const PrimaryButton = styled.button``

// ❌ 避免 - 不清晰的名称
export const Div1 = styled.div``
export const Wrapper = styled.div``
export const Btn = styled.button``
```

## 📐 代码风格

### 缩进和空格

```typescript
// ✅ 使用 2 空格缩进
function example() {
  if (condition) {
    return true
  }
  return false
}

// ✅ 对象和数组使用空格
const obj = { key: 'value' }
const arr = [1, 2, 3]

// ✅ 函数参数之间使用空格
function sum(a: number, b: number) {
  return a + b
}
```

### 引号使用

```typescript
// ✅ 推荐 - 统一使用单引号
const str = 'Hello World'
import { Component } from 'react'

// ✅ JSX 属性使用双引号
<div className="container" id="main" />

// ✅ 模板字符串使用反引号
const greeting = `Hello, ${name}!`
```

### 分号使用

```typescript
// ✅ 推荐 - 不使用分号（保持一致）
const name = 'John'
function greet() {
  return 'Hello'
}

// 或者全部使用分号（保持一致）
const name = 'John';
function greet() {
  return 'Hello';
}
```

## 🔍 注释规范

### 函数注释

```typescript
/**
 * 根据用户 ID 获取用户信息
 * @param userId - 用户唯一标识
 * @returns 用户对象，如果不存在返回 null
 */
function getUserById(userId: string): User | null {
  // 实现...
}
```

### 复杂逻辑注释

```typescript
// ✅ 好的注释 - 解释为什么这样做
// 使用防抖避免频繁的 API 请求
const debouncedSearch = debounce(searchUsers, 300)

// ❌ 不必要的注释 - 代码本身已经很清楚
// 设置 count 为 0
setCount(0)
```

### TODO 注释

```typescript
// TODO: 添加错误处理
// TODO: 优化性能
// FIXME: 修复在 Safari 中的显示问题
// NOTE: 这个方法将在下个版本废弃
```

## ✅ Git 提交规范

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构（不是新功能也不是 bug 修复）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
# 好的 commit message
feat(auth): add user login functionality
fix(header): resolve mobile menu issue
docs(readme): update installation guide
refactor(store): reorganize slice structure

# 不推荐
update files
fix bug
changes
```

## 🧪 测试规范

### 文件命名

```
component.test.tsx    # 组件测试
utils.test.ts        # 工具函数测试
```

### 测试用例组织

```typescript
describe('Button Component', () => {
  it('renders correctly', () => {
    // 测试渲染
  })
  
  it('handles click events', () => {
    // 测试点击事件
  })
  
  it('disables when disabled prop is true', () => {
    // 测试禁用状态
  })
})
```

## 📦 性能优化建议

### 1. 避免不必要的重新渲染

```typescript
// ✅ 使用 memo
import { memo } from 'react'

const ExpensiveComponent = memo(({ data }) => {
  // 组件内容
})

// ✅ 使用 useMemo
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

// ✅ 使用 useCallback
const memoizedCallback = useCallback(() => {
  doSomething(a, b)
}, [a, b])
```

### 2. 代码分割

```typescript
// ✅ 动态导入
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>
})
```

### 3. 图片优化

```typescript
// ✅ 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  priority
/>
```

## 🚨 常见错误避免

### 1. 状态管理

```typescript
// ❌ 直接修改 state
state.count++

// ✅ 使用 setState 或 Redux actions
setCount(count + 1)
dispatch(increment())
```

### 2. useEffect 依赖

```typescript
// ❌ 缺少依赖
useEffect(() => {
  fetchData(userId)
}, []) // userId 应该在依赖数组中

// ✅ 包含所有依赖
useEffect(() => {
  fetchData(userId)
}, [userId])
```

### 3. Key 属性

```typescript
// ❌ 使用索引作为 key
{items.map((item, index) => (
  <div key={index}>{item}</div>
))}

// ✅ 使用唯一标识
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

## 📚 推荐工具

- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查
- **Husky**: Git hooks
- **lint-staged**: 提交前检查

## 🎯 代码审查清单

### 组件结构
- [ ] 组件使用文件夹结构（包含 index.tsx 和 style.ts）
- [ ] 所有 styled-components 在 style.ts 中定义
- [ ] 组件逻辑在 index.tsx 中实现
- [ ] 样式组件正确导出和导入

### 代码质量
- [ ] 代码符合项目规范
- [ ] 没有 console.log 等调试代码
- [ ] 所有函数都有适当的类型定义
- [ ] 没有 any 类型（除非必要）
- [ ] 组件命名清晰语义化
- [ ] 适当的错误处理
- [ ] 性能优化（memo, useMemo, useCallback）
- [ ] 注释清晰必要
- [ ] Git commit message 规范

