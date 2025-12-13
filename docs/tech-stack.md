# 技术栈说明

## 🛠️ 核心技术

### Next.js 16.0.10
**现代化的 React 框架**

- **App Router**: 使用最新的 App Router 架构
- **服务端渲染**: 支持 SSR 和 SSG
- **文件系统路由**: 基于文件系统的路由
- **API Routes**: 内置 API 路由支持
- **优化功能**: 自动代码分割、图片优化等

**官方文档**: https://nextjs.org/docs

### React 19.2.1
**用户界面构建库**

- **React Server Components**: 支持服务端组件
- **Hooks**: 使用函数组件和 Hooks
- **并发特性**: 支持并发渲染
- **自动批处理**: 优化的状态更新

**官方文档**: https://react.dev/

### TypeScript 5.x
**类型安全的 JavaScript**

- **静态类型检查**: 编译时类型检查
- **智能提示**: 更好的 IDE 支持
- **代码重构**: 安全的重构工具
- **接口定义**: 清晰的 API 契约

**官方文档**: https://www.typescriptlang.org/

## 🎨 样式方案

### styled-components 6.1.19
**CSS-in-JS 解决方案**

**特性**:
- ✅ 组件化样式
- ✅ 动态样式支持
- ✅ 主题系统
- ✅ 服务端渲染
- ✅ TypeScript 支持
- ✅ 自动添加厂商前缀

**使用示例**:
```typescript
const Button = styled.button<{ $primary?: boolean }>`
  background: ${props => props.$primary ? '#0070f3' : '#eaeaea'};
  color: ${props => props.$primary ? 'white' : '#333'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
`
```

**官方文档**: https://styled-components.com/

## 📦 状态管理

### Redux Toolkit 2.11.1
**官方推荐的 Redux 工具集**

**特性**:
- ✅ 简化的 Store 配置
- ✅ 内置 Immer 支持
- ✅ Redux DevTools 集成
- ✅ createSlice API
- ✅ TypeScript 友好

**核心 API**:
- `configureStore()`: 创建 store
- `createSlice()`: 创建 reducer 和 actions
- `createAsyncThunk()`: 处理异步逻辑

**官方文档**: https://redux-toolkit.js.org/

### React-Redux 9.2.0
**React 的 Redux 绑定**

**提供**:
- `Provider`: 提供 store 给应用
- `useSelector`: 读取 state
- `useDispatch`: 发送 actions

## 🔧 开发工具

### ESLint 9.x
**代码质量检查**

- 代码规范检查
- 潜在错误检测
- 最佳实践提示

**配置文件**: `eslint.config.mjs`

### TypeScript Compiler
**类型检查和编译**

- 类型检查
- 代码转译
- 生成声明文件

**配置文件**: `tsconfig.json`

## 📦 依赖说明

### 生产依赖 (dependencies)

```json
{
  "next": "16.0.10",              // Next.js 框架
  "react": "19.2.1",              // React 库
  "react-dom": "19.2.1",          // React DOM 渲染
  "react-redux": "^9.2.0",        // Redux React 绑定
  "@reduxjs/toolkit": "^2.11.1",  // Redux 状态管理
  "styled-components": "^6.1.19"  // CSS-in-JS 样式
}
```

### 开发依赖 (devDependencies)

```json
{
  "@types/node": "^20",                    // Node.js 类型定义
  "@types/react": "^19",                   // React 类型定义
  "@types/react-dom": "^19",               // React DOM 类型定义
  "@types/styled-components": "^5.1.36",   // styled-components 类型
  "eslint": "^9",                          // 代码检查工具
  "eslint-config-next": "16.0.10",        // Next.js ESLint 配置
  "typescript": "^5"                       // TypeScript 编译器
}
```

## 🔌 集成方案

### styled-components + Next.js
**服务端渲染集成**

通过 `lib/registry.tsx` 实现 SSR 支持：
- 服务端样式收集
- 客户端样式注水
- 避免样式闪烁

### Redux + Next.js
**状态管理集成**

通过 `store/StoreProvider.tsx` 实现：
- 单例 store 管理
- App Router 兼容
- 类型安全的 hooks

## 🎯 技术选型理由

### 为什么选择 Next.js？
- ✅ 完整的 React 框架解决方案
- ✅ 优秀的开发体验
- ✅ 内置性能优化
- ✅ 强大的部署支持（Vercel）
- ✅ 活跃的社区和生态

### 为什么选择 Redux Toolkit？
- ✅ Redux 官方推荐
- ✅ 大幅简化 Redux 使用
- ✅ 最佳实践内置
- ✅ 优秀的 TypeScript 支持
- ✅ 适合中大型应用

### 为什么选择 styled-components？
- ✅ 组件化的样式管理
- ✅ 动态样式能力强
- ✅ 无样式冲突
- ✅ 主题系统完善
- ✅ TypeScript 支持好

## 🔄 技术栈版本管理

### 版本策略
- **主要依赖**: 使用固定版本（如 `16.0.10`）
- **工具依赖**: 使用兼容版本（如 `^5`）

### 更新建议
- **定期检查**: 每月检查依赖更新
- **测试验证**: 更新后进行完整测试
- **渐进式更新**: 一次更新一个主要依赖
- **查看更新日志**: 关注 Breaking Changes

### 更新命令

```bash
# 检查可更新的依赖
yarn outdated

# 更新依赖
yarn upgrade-interactive

# 更新特定包
yarn upgrade package-name@version
```

## 📚 学习资源

### 官方文档
- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [styled-components 文档](https://styled-components.com/)

### 推荐教程
- [Next.js 学习课程](https://nextjs.org/learn)
- [Redux Essentials](https://redux.js.org/tutorials/essentials/part-1-overview-concepts)
- [TypeScript 深入学习](https://www.typescriptlang.org/docs/handbook/intro.html)

