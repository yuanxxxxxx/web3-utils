This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. 配置环境变量

首次运行项目前，请先配置环境变量：

```bash
# 复制示例文件创建本地环境配置
cp .env.example .env.local

# 然后根据实际情况修改 .env.local 中的配置
```

更多环境配置说明，请查看 [环境配置文档](./docs/environment-config.md)

### 2. 运行开发服务器

```bash
# 默认开发环境（使用 .env.local）
yarn dev

# 使用特定环境配置
yarn dev:local   # 本地环境
yarn dev:test    # 测试环境
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 构建和部署

```bash
# 构建生产版本
yarn build:prod

# 启动生产服务器
yarn start:prod

# 构建其他环境
yarn build:dev   # 开发环境
yarn build:test  # 测试环境
```

## 项目文档

- [项目结构说明](./docs/project-structure.md)
- [环境配置说明](./docs/environment-config.md)
- [开发指南](./docs/development-guide.md)
- [技术栈说明](./docs/tech-stack.md)
- [样式开发指南](./docs/styling-guide.md)
- [Redux 状态管理](./docs/redux-guide.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
