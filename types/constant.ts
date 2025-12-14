import { mainnet, sepolia } from 'wagmi/chains'
import { LANGUAGE_ENUM, THEME_ENUM } from '.'

const NEXT_PUBLIC_ENV = process.env.NEXT_PUBLIC_ENV
console.log('NEXT_PUBLIC_ENV', process.env.NEXT_PUBLIC_ENV)

export const WEBSITE_CONFIG = {
  //网站相关
  appTitle: "Next App",
  appDescription: "Create by Next App",
  defaultLanguage: LANGUAGE_ENUM.en,
  defaultTheme: THEME_ENUM.light,


  //钱包相关
  appName: "Next App",
  walletConnectProjectId: "5e6165e29599e1c722b21aba02b7de8b",//https://cloud.walletconnect.com/
  supperChains: [mainnet, sepolia],
}