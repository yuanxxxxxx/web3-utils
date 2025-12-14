'use client'

import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit'
import {okxWallet, rainbowWallet, walletConnectWallet, metaMaskWallet} from "@rainbow-me/rainbowkit/wallets";
import { WEBSITE_CONFIG } from '@/types/constant';

const nameWallet = {
  appName: WEBSITE_CONFIG.appName,
  projectId: WEBSITE_CONFIG.walletConnectProjectId,//https://cloud.walletconnect.com/
}

// 只在浏览器环境中初始化 connectors
const connectors = typeof window !== 'undefined' ? connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, rainbowWallet, okxWallet, walletConnectWallet],
    },
  ],
  nameWallet
) : [];

export const config = getDefaultConfig({
  appName: WEBSITE_CONFIG.appName,
  projectId: WEBSITE_CONFIG.walletConnectProjectId,
  chains: WEBSITE_CONFIG.supperChains as any,
  ssr: false,
  // @ts-ignore
  connectors,
})
