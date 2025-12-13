# 命令快速参考

## 开发命令

| 命令 | 说明 | 使用环境 |
|------|------|----------|
| `yarn dev` | 启动开发服务器 | `.env.local` |
| `yarn dev:local` | 启动开发服务器（本地环境） | `.env.local` |
| `yarn dev:test` | 启动开发服务器（测试环境） | `.env.test` |

## 构建命令

| 命令 | 说明 | 使用环境 |
|------|------|----------|
| `yarn build` | 构建生产版本 | `.env` |
| `yarn build:dev` | 构建开发环境版本 | `.env.development` |
| `yarn build:test` | 构建测试环境版本 | `.env.test` |
| `yarn build:prod` | 构建生产环境版本 | `.env.production` |

## 启动命令

| 命令 | 说明 | 使用环境 |
|------|------|----------|
| `yarn start` | 启动生产服务器 | `.env` |
| `yarn start:dev` | 启动生产服务器（开发环境配置） | `.env.development` |
| `yarn start:test` | 启动生产服务器（测试环境配置） | `.env.test` |
| `yarn start:prod` | 启动生产服务器（生产环境配置） | `.env.production` |

## 其他命令

| 命令 | 说明 |
|------|------|
| `yarn lint` | 运行代码检查 |

## 常用工作流

### 本地开发
```bash
yarn dev
```

### 测试部署前构建
```bash
yarn build:test
yarn start:test
```

### 生产部署
```bash
yarn build:prod
yarn start:prod
```

## 环境文件说明

- `.env.local` - 本地开发配置（不提交到 Git）
- `.env.development` - 开发环境配置
- `.env.test` - 测试环境配置
- `.env.production` - 生产环境配置
- `.env.example` - 环境变量示例

详细说明请查看 [环境配置文档](./docs/environment-config.md)
