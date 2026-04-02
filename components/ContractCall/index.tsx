'use client'

import { useState, useMemo, useEffect } from 'react'
import { isAddress } from 'viem'
import useChainManager from '@/hooks/useChainManager'
import useAbiParser from '@/hooks/useAbiParser'
import useContractCall from '@/hooks/useContractCall'
import useActiveWeb3React from '@/hooks/useActiveWeb3React'
import ChainSelector from './ChainSelector'
import ContractInput from './ContractInput'
import CallerSelector, { CallerMode } from './CallerSelector'
import MethodList from './MethodList'
import {
  ToolWrapper,
  ConfigPanel,
  ConfigRow,
  ConfigLabel,
  SectionDivider,
  MethodPanel,
  PageHeader,
  PageTitle,
  PageSubtitle,
} from './style'

const STORAGE_KEY = 'contract_call_form'

interface StoredForm {
  contractAddress: string
  abiString: string
  callerMode: CallerMode
  selectedChainId: number
}

function loadStoredForm(): Partial<StoredForm> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function isValidPrivateKey(key: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(key.trim())
}

export default function ContractCallTool() {
  const [contractAddress, setContractAddress] = useState('')
  const [abiString, setAbiString] = useState('')
  const [callerMode, setCallerMode] = useState<CallerMode>('wallet')
  const [privateKey, setPrivateKey] = useState('')

  const {
    selectedChainId,
    setSelectedChainId,
    customChains,
    allChainOptions,
    selectedChain,
    publicClient,
    addCustomChain,
    removeCustomChain,
    getExplorerUrl,
    initialized,
  } = useChainManager()

  // 客户端 mount 后，从 localStorage 一次性恢复所有字段
  useEffect(() => {
    if (!initialized) return
    const stored = loadStoredForm()
    if (stored.contractAddress) setContractAddress(stored.contractAddress)
    if (stored.abiString) setAbiString(stored.abiString)
    if (stored.callerMode) setCallerMode(stored.callerMode)
    if (stored.selectedChainId) setSelectedChainId(stored.selectedChainId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized])

  // 状态变更时同步到 localStorage（initialized 为 true 后才持久化，避免覆盖存储值）
  useEffect(() => {
    if (!initialized || typeof window === 'undefined') return
    try {
      const form: StoredForm = { contractAddress, abiString, callerMode, selectedChainId }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    } catch {
      // ignore
    }
  }, [initialized, contractAddress, abiString, callerMode, selectedChainId])

  const { readMethods, writeMethods, parseError, rawAbi, totalMethods } = useAbiParser(abiString)

  const { account } = useActiveWeb3React()

  const selectedChainRpcUrl = useMemo(() => {
    const custom = customChains.find((c) => c.id === selectedChainId)
    return custom?.rpcUrl
  }, [customChains, selectedChainId])

  const contractReady = useMemo(
    () => isAddress(contractAddress) && rawAbi.length > 0,
    [contractAddress, rawAbi]
  )

  const callerReady = useMemo(() => {
    if (callerMode === 'wallet') return !!account
    if (callerMode === 'privateKey') return isValidPrivateKey(privateKey)
    return false
  }, [callerMode, account, privateKey])

  const { callRead, callWrite } = useContractCall({
    selectedChain,
    rpcUrl: selectedChainRpcUrl,
    contractAddress: contractAddress as `0x${string}`,
    abi: rawAbi,
    callerMode,
    privateKey,
    walletPublicClient: publicClient,
  })

  const handleCall = async (
    functionName: string,
    args: unknown[],
    ethValue?: string,
    options?: { force?: boolean }
  ) => {
    const methods = [...readMethods, ...writeMethods]
    const method = methods.find((m) => m.name === functionName)
    if (!method) return { success: false, error: '方法未找到' }

    if (method.isReadOnly) {
      return callRead(functionName, args)
    } else {
      return callWrite(functionName, args, ethValue, options)
    }
  }

  const explorerUrlFn = (hash: string, type: 'tx' | 'address') =>
    getExplorerUrl(hash, type)

  return (
    <ToolWrapper>
      <PageHeader>
        <PageTitle>合约调用工具</PageTitle>
        <PageSubtitle>
          选择网络、填写合约地址和 ABI，自动生成读写方法并支持钱包或私钥进行调用
        </PageSubtitle>
      </PageHeader>

      <ConfigPanel>
        <ConfigRow>
          <ConfigLabel>🔗 选择网络</ConfigLabel>
          <ChainSelector
            allChainOptions={allChainOptions}
            selectedChainId={selectedChainId}
            customChains={customChains}
            onSelect={setSelectedChainId}
            onAddCustomChain={addCustomChain}
            onRemoveCustomChain={removeCustomChain}
          />
        </ConfigRow>

        <SectionDivider />

        <ContractInput
          contractAddress={contractAddress}
          onAddressChange={setContractAddress}
          abiString={abiString}
          onAbiChange={setAbiString}
          parseError={parseError}
          totalMethods={totalMethods}
        />

        <SectionDivider />

        <ConfigRow>
          <ConfigLabel>👤 调用身份</ConfigLabel>
          <CallerSelector
            mode={callerMode}
            onModeChange={setCallerMode}
            privateKey={privateKey}
            onPrivateKeyChange={setPrivateKey}
            selectedChainId={selectedChainId}
          />
        </ConfigRow>
      </ConfigPanel>

      <MethodPanel>
        <MethodList
          readMethods={readMethods}
          writeMethods={writeMethods}
          contractReady={contractReady}
          callerReady={callerReady}
          explorerUrl={explorerUrlFn}
          onCall={handleCall}
        />
      </MethodPanel>
    </ToolWrapper>
  )
}
