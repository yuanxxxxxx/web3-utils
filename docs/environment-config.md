# 环境配置说明

本项目支持多环境配置，可以在不同的环境中使用不同的配置参数。

## 环境文件说明

项目中包含以下环境配置文件：

### `.env.local` (本地开发)
- **用途**: 本地开发环境，个人配置
- **特点**: 不会提交到 Git，优先级最高
- **使用场景**: 本地开发时的个性化配置

### `.env.development` (开发环境)
- **用途**: 团队共享的开发环境配置
- **特点**: 会提交到 Git
- **使用场景**: 连接开发服务器、开发数据库等

### `.env.test` (测试环境)
- **用途**: 测试环境配置
- **特点**: 会提交到 Git
- **使用场景**: 自动化测试、QA 测试等

### `.env.production` (生产环境)
- **用途**: 生产环境配置模板
- **特点**: 会提交到 Git，但不包含敏感信息
- **使用场景**: 生产部署时的配置参考

### `.env.example` (配置示例)
- **用途**: 环境变量示例文件
- **特点**: 会提交到 Git
- **使用场景**: 新成员参考，了解需要配置哪些环境变量

## 环境变量说明

### 公共环境变量（前端可访问）

以 `NEXT_PUBLIC_` 开头的变量会被打包到前端代码中：

- `NEXT_PUBLIC_ENV`: 当前环境标识 (local/development/test/production)
- `NEXT_PUBLIC_API_URL`: API 接口地址
- `NEXT_PUBLIC_APP_NAME`: 应用名称

### 私有环境变量（仅服务端可访问）

不以 `NEXT_PUBLIC_` 开头的变量只在服务端可用：

- `DATABASE_URL`: 数据库连接字符串
- `API_KEY`: API 密钥
- 其他敏感信息

## 启动命令说明

### 开发环境启动

```bash
# 默认开发环境（使用 .env.local）
yarn dev

# 使用本地环境配置
yarn dev:local

# 使用测试环境配置
yarn dev:test
```

### 构建命令

```bash
# 默认构建（使用 .env）
yarn build

# 开发环境构建
yarn build:dev

# 测试环境构建
yarn build:test

# 生产环境构建
yarn build:prod
```

### 启动生产服务器

```bash
# 默认启动
yarn start

# 使用开发环境配置启动
yarn start:dev

# 使用测试环境配置启动
yarn start:test

# 使用生产环境配置启动
yarn start:prod
```

## 使用方法

### 1. 初始化环境配置

首次克隆项目后，复制示例文件创建本地配置：

```bash
cp .env.example .env.local
```

然后根据实际情况修改 `.env.local` 中的配置。

### 2. 在代码中使用环境变量

#### 前端代码中使用

```typescript
// 只能访问 NEXT_PUBLIC_ 开头的变量
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const envName = process.env.NEXT_PUBLIC_ENV;
const appName = process.env.NEXT_PUBLIC_APP_NAME;
```

#### 服务端代码中使用

```typescript
// 可以访问所有环境变量
const databaseUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;

// 也可以访问公共变量
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### 3. 在组件中显示当前环境

```typescript
export default function Header() {
  const env = process.env.NEXT_PUBLIC_ENV;
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  
  return (
    <header>
      <h1>{appName}</h1>
      {env !== 'production' && (
        <span>Environment: {env}</span>
      )}
    </header>
  );
}
```

## 环境变量加载优先级

Next.js 按以下优先级加载环境变量（优先级从高到低）：

1. `process.env` (系统环境变量)
2. `.env.$(NODE_ENV).local` (如 `.env.development.local`)
3. `.env.local` (本地配置，NODE_ENV=test 时不加载)
4. `.env.$(NODE_ENV)` (如 `.env.development`)
5. `.env` (默认配置)

## 安全注意事项

1. **永远不要**在环境文件中存储真实的敏感信息（密码、密钥等）
2. **永远不要**提交 `.env.local` 到 Git
3. **使用密钥管理服务**（如 AWS Secrets Manager、Azure Key Vault）管理生产环境的敏感信息
4. **定期轮换**API 密钥和访问令牌
5. 在 CI/CD 中使用环境变量或密钥管理服务注入敏感信息

## 常见问题

### Q: 为什么我的环境变量没有生效？

A: 
1. 确保变量名以 `NEXT_PUBLIC_` 开头（如果需要在前端使用）
2. 修改环境变量后需要重启开发服务器
3. 检查环境文件是否存在语法错误

### Q: 如何在不同环境使用不同的 API 地址？

A: 在对应的 `.env.*` 文件中设置不同的 `NEXT_PUBLIC_API_URL` 值，然后使用对应的启动命令。

### Q: 生产环境如何注入敏感信息？

A: 建议使用 CI/CD 平台的环境变量功能或密钥管理服务，不要在 `.env.production` 中存储敏感信息。

## 相关资源

- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
- [环境变量最佳实践](https://12factor.net/config)
