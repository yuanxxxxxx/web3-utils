'use client'

import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'
import {okxWallet, rainbowWallet, walletConnectWallet, metaMaskWallet} from "@rainbow-me/rainbowkit/wallets";
import { injected, metaMask, coinbaseWallet } from 'wagmi/connectors'

const nameWallet = {
  appName: 'Next App',
  projectId: '5e6165e29599e1c722b21aba02b7de8b',//https://cloud.walletconnect.com/
}

// 只在浏览器环境中初始化 connectors
const connectors = typeof window !== 'undefined' ? connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, rainbowWallet, okxWallet, walletConnectWallet],
    },
  ],
  {
    ...nameWallet
  }
) : [];

export const config = getDefaultConfig({
  appName: 'Next App',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '5e6165e29599e1c722b21aba02b7de8b',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
  // @ts-ignore
  connectors,
})
