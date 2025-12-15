import { mainnet, sepolia } from 'wagmi/chains'
import { LANGUAGE_ENUM, THEME_ENUM } from '.'

const NEXT_PUBLIC_ENV = process.env.NEXT_PUBLIC_ENV
console.log('NEXT_PUBLIC_ENV', process.env.NEXT_PUBLIC_ENV)
const isProduction = NEXT_PUBLIC_ENV === 'production'

export const WEBSITE_CONFIG = {
  //网站相关
  appTitle: "Next App",
  appDescription: "Create by Next App",
  defaultLanguage: LANGUAGE_ENUM.en,
  defaultTheme: THEME_ENUM.light,

  //钱包相关
  appName: "Next App",
  walletConnectProjectId: "5e6165e29599e1c722b21aba02b7de8b",//https://cloud.walletconnect.com/
  supperChains: [sepolia],
  defaultChain: sepolia,

  //IPFS Pinada配置
  pinadaConfig : {
    apiKey: '448a4e008327d0394388',
    apiSecret: 'c71ac064aa851db8fc179f7a923e801a14b2ea04b649dfef4bd3dfcda898e210',
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5OGIxY2QxMS0wZGI0LTQ2MzQtYTU5OS1jM2JkOGZiZmRmOTMiLCJlbWFpbCI6IjMxODU5MTEwMkBxcS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNDQ4YTRlMDA4MzI3ZDAzOTQzODgiLCJzY29wZWRLZXlTZWNyZXQiOiJjNzFhYzA2NGFhODUxZGI4ZmMxNzlmN2E5MjNlODAxYTE0YjJlYTA0YjY0OWRmZWY0YmQzZGZjZGE4OThlMjEwIiwiZXhwIjoxNzk2MzUzMTcwfQ.xq1cuU5miQEIalbKc48CAf0HMYsh0yOTxHBiuNMtHj4',
    apiUrl: 'https://api.pinata.cloud',
    // fileUrl: 'https://nftstorage.link/ipfs',
    // fileUrl: 'https://gateway.pinata.cloud/ipfs/',
    fileUrl: 'https://fuchsia-tragic-mastodon-173.mypinata.cloud/ipfs/',
  },

  // 接口相关
  API_BASE_URL: "https://api.cai.fun/testnet/api/",

  // 其他配置
  needSignLogin: true,//是否需要签名登录
}

// 其他声明
export const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
export const MAX_UINT48 = '0xFFFFFFFFFFFF'
export const MAX_UINT160 = '0xffffffffffffffffffffffffffffffffffffffff'

export const LOGIN_TOKEN_LOCAL_KEY = "LOGIN_TOKEN_LOCAL_KEY";
export const LANGUAGE_LOCAL_KEY = "LANGUAGE_LOCAL_KEY";
export const THEME_LOCAL_KEY = "THEME_LOCAL_KEY";
