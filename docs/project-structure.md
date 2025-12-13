# 项目结构说明

## 📁 目录结构

```
new-cli/
├── app/                          # Next.js App Router 目录
│   ├── layout.tsx               # 根布局组件
│   ├── page.tsx                 # 首页
│   ├── globals.css              # 全局样式
│   ├── example/                 # Example 页面
│   │   └── page.tsx
│   └── test/                    # Test 页面
│       └── page.tsx
│
├── components/                   # 可复用组件
│   ├── Header/                  # 全局导航栏组件
│   │   ├── index.tsx           # 组件逻辑
│   │   └── style.ts            # 样式定义
│   ├── ReduxCounter/            # Redux 计数器示例
│   │   ├── index.tsx
│   │   └── style.ts
│   ├── AppSettings/             # 应用设置组件
│   │   ├── index.tsx
│   │   └── style.ts
│   ├── UserProfile/             # 用户信息组件
│   │   ├── index.tsx
│   │   └── style.ts
│   └── StyledExample/           # styled-components 示例
│       ├── index.tsx
│       └── style.ts
│
├── store/                        # Redux 状态管理
│   ├── store.ts                 # Store 配置
│   ├── hooks.ts                 # 类型安全的 Hooks
│   ├── StoreProvider.tsx        # Redux Provider 组件
│   ├── appSlice.ts              # 应用全局状态
│   ├── userSlice.ts             # 用户信息状态
│   └── counterSlice.ts          # 计数器状态
│
├── lib/                          # 工具库
│   └── registry.tsx             # styled-components SSR 注册
│
├── docs/                         # 项目文档
│   ├── README.md
│   ├── project-structure.md
│   ├── tech-stack.md
│   ├── redux-guide.md
│   ├── styling-guide.md
│   └── development-guide.md
│
├── public/                       # 静态资源
│   ├── file.svg
│   ├── globe.svg
│   └── ...
│
├── next.config.ts               # Next.js 配置
├── tsconfig.json                # TypeScript 配置
├── package.json                 # 项目依赖
└── yarn.lock                    # 依赖锁定文件
```

## 📂 目录说明

### `app/` - 应用路由

Next.js 13+ App Router 目录，所有页面路由都在此目录下。

- **layout.tsx**: 根布局，包含全局 Provider（Redux、styled-components）
- **page.tsx**: 首页（`/` 路由）
- **example/**: Example 页面目录（`/example` 路由）
- **test/**: Test 页面目录（`/test` 路由）

**路由规则**:
- 每个文件夹代表一个路由段
- `page.tsx` 是该路由的页面组件
- `layout.tsx` 是该路由段的布局组件

### `components/` - 组件库

可复用的 React 组件。

**组件结构规范**:
每个组件必须是一个文件夹，包含以下文件：
- `index.tsx` - 组件逻辑、状态管理、事件处理
- `style.ts` - 所有 styled-components 样式定义

**命名规范**:
- 文件夹使用 PascalCase（大驼峰）命名
- `index.tsx` 和 `style.ts` 固定命名
- 样式组件在 `style.ts` 中使用 export 导出

**组件分类**:
- **布局组件**: Header
- **功能组件**: ReduxCounter, AppSettings, UserProfile
- **示例组件**: StyledExample

### `store/` - 状态管理

Redux Toolkit 状态管理相关文件。

**文件说明**:

| 文件 | 作用 |
|------|------|
| `store.ts` | 配置和创建 Redux store |
| `hooks.ts` | 类型安全的自定义 hooks |
| `StoreProvider.tsx` | Redux Provider 包装组件 |
| `*Slice.ts` | 各个功能模块的 slice |

**Slice 分类**:
- **appSlice**: 应用全局配置（主题、语言等）
- **userSlice**: 用户信息和认证状态
- **counterSlice**: 示例功能模块

### `lib/` - 工具库

通用工具和配置文件。

- **registry.tsx**: styled-components 的服务端渲染支持

### `docs/` - 文档

项目文档和开发指南。

### `public/` - 静态资源

静态文件，可通过 `/` 路径直接访问。

- 图片、图标、字体等
- 不会被 webpack 处理
- 直接复制到输出目录

## 🔄 文件命名规范

### 组件文件
- **组件文件夹**: PascalCase（如 `UserProfile/`）
- **组件逻辑文件**: index.tsx
- **组件样式文件**: style.ts
- **页面组件**: page.tsx
- **布局组件**: layout.tsx

### 其他文件
- **工具函数**: camelCase.ts（如 `formatDate.ts`）
- **类型定义**: types.ts 或 index.ts
- **配置文件**: kebab-case.config.ts（如 `next.config.ts`）

### Redux 文件
- **Slice 文件**: camelCaseSlice.ts（如 `userSlice.ts`）
- **Store 文件**: store.ts
- **Hooks 文件**: hooks.ts

## 📝 新增组件流程

### 创建新组件

```bash
# 1. 创建组件文件夹
mkdir components/YourComponent

# 2. 创建必要文件
touch components/YourComponent/index.tsx
touch components/YourComponent/style.ts
```

### 组件文件结构

```typescript
// components/YourComponent/style.ts
import styled from 'styled-components'

export const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
`

export const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
`

// components/YourComponent/index.tsx
'use client'

import { Container, Title } from './style'

export default function YourComponent() {
  return (
    <Container>
      <Title>Your Component</Title>
    </Container>
  )
}
```

## 📝 新增页面流程

### 1. 创建路由目录

```bash
# 创建新页面目录
mkdir app/your-page
```

### 2. 创建页面组件

```typescript
// app/your-page/page.tsx
'use client'

import styled from 'styled-components'

const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: 64px;
`

export default function YourPage() {
  return (
    <PageContainer>
      <h1>Your Page</h1>
    </PageContainer>
  )
}
```

### 3. 添加导航链接

在 `components/Header/index.tsx` 中添加导航链接：

```typescript
<NavLink href="/your-page" $active={pathname === '/your-page'}>
  Your Page
</NavLink>
```

## 🎯 最佳实践

1. **保持文件小而专注**: 每个文件只做一件事
2. **使用绝对路径导入**: 使用 `@/` 别名（已配置在 tsconfig.json）
3. **组件文件夹结构**: 所有组件必须使用文件夹+index.tsx+style.ts 结构
4. **样式分离**: 所有 styled-components 必须放在 style.ts 中
5. **组件放在 components/**: 可复用组件统一管理
6. **页面组件放在 app/**: 遵循 Next.js App Router 规范
7. **类型定义就近原则**: 在使用的文件中定义类型，或创建独立的 types 文件

