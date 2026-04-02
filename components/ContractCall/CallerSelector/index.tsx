'use client'

import { useState, useEffect } from 'react'
import { privateKeyToAccount } from 'viem/accounts'
import { useSwitchChain } from 'wagmi'
import { toFormatAccount } from '@/utils/format'
import useActiveWeb3React from '@/hooks/useActiveWeb3React'
import {
  CallerWrapper,
  ModeToggle,
  ModeTab,
  WalletPanel,
  WalletInfo,
  WalletAddress,
  ConnectBtn,
  DisconnectBtn,
  ChainMismatchAlert,
  AlertText,
  SwitchChainBtn,
  PrivateKeyPanel,
  PrivateKeyRow,
  PrivateKeyInput,
  DerivedAddress,
  DerivedLabel,
  DerivedAddressText,
  SecurityTip,
  FieldHint,
} from './style'

export type CallerMode = 'wallet' | 'privateKey'

interface Props {
  mode: CallerMode
  onModeChange: (mode: CallerMode) => void
  privateKey: string
  onPrivateKeyChange: (key: string) => void
  selectedChainId: number
}

function isValidPrivateKey(key: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(key.trim())
}

function deriveAddress(privateKey: string): string | null {
  try {
    const account = privateKeyToAccount(privateKey as `0x${string}`)
    return account.address
  } catch {
    return null
  }
}

export default function CallerSelector({
  mode,
  onModeChange,
  privateKey,
  onPrivateKeyChange,
  selectedChainId,
}: Props) {
  const { account, openConnectModal, loginOut, chainId: walletChainId } = useActiveWeb3React()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const [showKey, setShowKey] = useState(false)
  const [derivedAddress, setDerivedAddress] = useState<string | null>(null)

  const isKeyValid = privateKey ? isValidPrivateKey(privateKey) : null
  const isKeyInvalid = privateKey && !isValidPrivateKey(privateKey)

  const chainMismatch = mode === 'wallet' && !!account && !!walletChainId && walletChainId !== selectedChainId

  useEffect(() => {
    if (privateKey && isValidPrivateKey(privateKey)) {
      setDerivedAddress(deriveAddress(privateKey))
    } else {
      setDerivedAddress(null)
    }
  }, [privateKey])

  const handleSwitchChain = () => {
    try {
      switchChain({ chainId: selectedChainId })
    } catch {
      // ignore
    }
  }

  return (
    <CallerWrapper>
      <ModeToggle>
        <ModeTab $active={mode === 'wallet'} onClick={() => onModeChange('wallet')}>
          🔗 连接钱包
        </ModeTab>
        <ModeTab $active={mode === 'privateKey'} onClick={() => onModeChange('privateKey')}>
          🔑 私钥输入
        </ModeTab>
      </ModeToggle>

      {mode === 'wallet' && (
        <WalletPanel>
          {account ? (
            <>
              <WalletInfo>
                <WalletAddress>已连接：{toFormatAccount(account)}</WalletAddress>
                <DisconnectBtn onClick={loginOut}>断开连接</DisconnectBtn>
              </WalletInfo>
              {chainMismatch && (
                <ChainMismatchAlert>
                  <AlertText>
                    ⚠️ 钱包当前网络（Chain ID: {walletChainId}）与所选链（Chain ID:{' '}
                    {selectedChainId}）不一致，写操作可能失败
                  </AlertText>
                  <SwitchChainBtn onClick={handleSwitchChain} disabled={isSwitching}>
                    {isSwitching ? '切换中...' : '切换网络'}
                  </SwitchChainBtn>
                </ChainMismatchAlert>
              )}
            </>
          ) : (
            <ConnectBtn onClick={openConnectModal}>连接钱包</ConnectBtn>
          )}
          <FieldHint $type="info">
            连接钱包后可调用读写方法。读方法无需签名，写方法需要钱包签名授权。
          </FieldHint>
        </WalletPanel>
      )}

      {mode === 'privateKey' && (
        <PrivateKeyPanel>
          <SecurityTip>
            🔒 私钥仅在本地浏览器内存中使用，不会上传到任何服务器或写入本地存储。
          </SecurityTip>
          <PrivateKeyRow>
            <PrivateKeyInput
              type={showKey ? 'text' : 'password'}
              value={privateKey}
              onChange={(e) => onPrivateKeyChange(e.target.value)}
              placeholder="0x + 64位十六进制私钥"
              $error={!!isKeyInvalid}
              $valid={!!isKeyValid}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1.5px solid #d0d5dd',
                background: '#fff',
                cursor: 'pointer',
                fontSize: 13,
                color: '#667085',
                whiteSpace: 'nowrap',
              }}
            >
              {showKey ? '隐藏' : '显示'}
            </button>
          </PrivateKeyRow>
          {isKeyInvalid && (
            <FieldHint $type="error">
              私钥格式无效，请输入以 0x 开头的 64 位十六进制字符串
            </FieldHint>
          )}
          {derivedAddress && (
            <DerivedAddress>
              <DerivedLabel>派生地址：</DerivedLabel>
              <DerivedAddressText>{derivedAddress}</DerivedAddressText>
            </DerivedAddress>
          )}
          <FieldHint $type="info">
            私钥模式支持所有链（包括自定义链），读写方法均可使用。
          </FieldHint>
        </PrivateKeyPanel>
      )}
    </CallerWrapper>
  )
}
