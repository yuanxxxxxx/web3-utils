# 样式开发指南

## 🎨 styled-components 使用规范

### 基础用法

#### 创建基础组件

```typescript
import styled from 'styled-components'

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #0070f3;
  color: white;
  
  &:hover {
    background-color: #0051cc;
  }
`
```

#### 动态样式（Props）

```typescript
interface ButtonProps {
  $primary?: boolean
  $size?: 'small' | 'medium' | 'large'
}

const Button = styled.button<ButtonProps>`
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '0.5rem 1rem'
      case 'large': return '1rem 2rem'
      default: return '0.75rem 1.5rem'
    }
  }};
  background-color: ${props => props.$primary ? '#0070f3' : '#eaeaea'};
  color: ${props => props.$primary ? 'white' : '#333'};
`

// 使用
<Button $primary $size="large">Click me</Button>
```

**注意**: 使用 `$` 前缀的 props 不会传递到 DOM 元素，避免 React 警告。

#### 继承样式

```typescript
const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
`

const PrimaryButton = styled(Button)`
  background-color: #0070f3;
  color: white;
`

const DangerButton = styled(Button)`
  background-color: #ef4444;
  color: white;
`
```

## 📐 组件样式组织

### 文件结构规范

**所有组件必须遵循文件夹结构**:
```
components/
└── MyComponent/
    ├── index.tsx    # 组件逻辑
    └── style.ts     # 样式定义
```

### style.ts - 样式文件

```typescript
// components/MyComponent/style.ts
import styled from 'styled-components'

// 导出所有样式组件（按组件层次从外到内）
export const Container = styled.div`
  padding: 2rem;
`

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
`

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`
```

### index.tsx - 组件逻辑

```typescript
// components/MyComponent/index.tsx
'use client'

import { useState } from 'react'
import { Container, Title, Button } from './style'

export default function MyComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <Container>
      <Title>Count: {count}</Title>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </Container>
  )
}
```

### 规范要点

1. **样式分离**: 所有 styled-components 必须在 style.ts 中定义
2. **导出方式**: 使用 export 导出每个样式组件
3. **导入方式**: 在 index.tsx 中从 './style' 导入需要的样式组件
4. **命名一致**: 样式组件名称要清晰表达用途

### 命名规范

#### 样式组件命名
- 使用 PascalCase
- 名称应描述组件的语义而非样式
- 避免使用缩写
- 在 style.ts 中统一 export

```typescript
// ✅ 好的命名（在 style.ts 中）
export const Button = styled.button``
export const Container = styled.div``
export const NavigationBar = styled.nav``
export const UserAvatar = styled.img``

// ❌ 不好的命名
export const Btn = styled.button``
export const Div1 = styled.div``
export const BlueBox = styled.div``
export const StyledComponent = styled.div``
```

#### 组件文件夹命名
- 使用 PascalCase
- 名称应清晰表达组件功能

```
✅ 好的命名
components/UserProfile/
components/NavigationBar/
components/SearchInput/

❌ 不好的命名
components/UP/
components/Nav1/
components/Component1/
```

## 🎭 常用样式模式

### 布局

#### Flex 布局
```typescript
const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
```

#### Grid 布局
```typescript
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`
```

#### 固定定位
```typescript
const FixedHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`
```

### 响应式设计

```typescript
const Container = styled.div`
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`

// 使用变量
const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px'
}

const ResponsiveDiv = styled.div`
  font-size: 1rem;
  
  @media (max-width: ${breakpoints.tablet}) {
    font-size: 0.875rem;
  }
`
```

### 动画和过渡

```typescript
import styled, { keyframes } from 'styled-components'

// 定义动画
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const AnimatedDiv = styled.div`
  animation: ${fadeIn} 0.3s ease-in-out;
`

// 过渡效果
const Button = styled.button`
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`
```

### 伪类和伪元素

```typescript
const Button = styled.button`
  position: relative;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`
```

## 🎨 主题系统

### 定义主题

```typescript
// lib/theme.ts
export const lightTheme = {
  colors: {
    primary: '#0070f3',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#333333',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  }
}

export const darkTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#9ca3af',
    background: '#1a1a1a',
    text: '#f5f5f5',
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
}

export type Theme = typeof lightTheme
```

### 使用主题

```typescript
import { ThemeProvider } from 'styled-components'
import { lightTheme } from './lib/theme'

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <YourApp />
    </ThemeProvider>
  )
}

// 在组件中使用
const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.medium};
`
```

## 📦 组件库示例

### 按钮组件

```typescript
// components/Button/style.ts
import styled from 'styled-components'

interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger'
  $size?: 'small' | 'medium' | 'large'
  $fullWidth?: boolean
}

export const StyledButton = styled.button<ButtonProps>`
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '0.5rem 1rem'
      case 'large': return '1rem 2rem'
      default: return '0.75rem 1.5rem'
    }
  }};
  
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${props => {
    switch (props.$variant) {
      case 'danger': return '#ef4444'
      case 'secondary': return '#6b7280'
      default: return '#0070f3'
    }
  }};
  
  color: white;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

// components/Button/index.tsx
'use client'

import { StyledButton } from './style'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  disabled?: boolean
}

export default function Button({ children, onClick, variant, size, fullWidth, disabled }: ButtonProps) {
  return (
    <StyledButton 
      onClick={onClick}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  )
}
```

### 输入框组件

```typescript
// components/Input/style.ts
import styled from 'styled-components'

export const StyledInput = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`

// components/Input/index.tsx
'use client'

import { StyledInput } from './style'

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
}

export default function Input({ value, onChange, placeholder, type = 'text', disabled }: InputProps) {
  return (
    <StyledInput
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  )
}
```

### 卡片组件

```typescript
// components/Card/style.ts
import styled from 'styled-components'

export const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }
`

export const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`

export const CardContent = styled.div`
  color: #666;
  line-height: 1.6;
`

// components/Card/index.tsx
'use client'

import { CardContainer, CardTitle, CardContent } from './style'

interface CardProps {
  title?: string
  children: React.ReactNode
}

export default function Card({ title, children }: CardProps) {
  return (
    <CardContainer>
      {title && <CardTitle>{title}</CardTitle>}
      <CardContent>{children}</CardContent>
    </CardContainer>
  )
}
```

## 🎯 最佳实践

### 1. 严格遵循文件结构
```typescript
// ✅ 正确的结构
components/
└── UserProfile/
    ├── index.tsx     # 组件逻辑
    └── style.ts      # 样式定义

// ❌ 错误的结构
components/
└── UserProfile.tsx   # 不要使用单文件
```

### 2. 样式完全分离
```typescript
// ✅ 好 - 样式在 style.ts
// components/Button/style.ts
export const StyledButton = styled.button`
  padding: 1rem;
`

// components/Button/index.tsx
import { StyledButton } from './style'

// ❌ 不好 - 样式混在 index.tsx
// components/Button/index.tsx
const StyledButton = styled.button`
  padding: 1rem;
`
```

### 3. 使用语义化命名
```typescript
// ✅ 好
export const NavigationBar = styled.nav``
export const UserProfile = styled.div``

// ❌ 不好
export const BlueDiv = styled.div``
export const Container1 = styled.div``
```

### 4. 避免内联样式
```typescript
// ❌ 避免
<div style={{ padding: '1rem', color: 'red' }}>Content</div>

// ✅ 推荐 - 在 style.ts 中定义
export const Content = styled.div`
  padding: 1rem;
  color: red;
`
```

### 5. 使用 CSS 变量作为常量
```typescript
// components/Button/style.ts
const colors = {
  primary: '#0070f3',
  danger: '#ef4444',
}

export const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
  background-color: ${props => 
    props.$variant === 'danger' ? colors.danger : colors.primary
  };
`
```

### 6. 组件解耦
```typescript
// ✅ 好 - 组件可独立复用
export const Button = styled.button`
  padding: 0.75rem 1.5rem;
`

export const Container = styled.div`
  display: flex;
  gap: 1rem;
`

// ❌ 不好 - 过度耦合
export const Container = styled.div`
  display: flex;
  
  button {
    padding: 0.75rem 1.5rem;
  }
`
```

### 7. 性能优化
```typescript
// ✅ 在 style.ts 中定义（文件级别，只创建一次）
// components/Button/style.ts
export const StyledButton = styled.button``

// components/Button/index.tsx
import { StyledButton } from './style'
function MyComponent() {
  return <StyledButton>Click</StyledButton>
}

// ❌ 避免在组件内部定义（每次渲染都会创建新的组件）
function MyComponent() {
  const Button = styled.button``
  return <Button>Click</Button>
}
```

## 🔧 工具和插件

### VSCode 插件
- **vscode-styled-components**: 语法高亮和智能提示
- **Styled Components Snippets**: 代码片段

### 浏览器插件
- **Styled Components DevTools**: 调试样式组件

## 📚 参考资源

- [styled-components 官方文档](https://styled-components.com/)
- [styled-components 最佳实践](https://styled-components.com/docs/basics#motivation)

