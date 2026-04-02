'use client'

import { useCallback, useMemo } from 'react'
import {
  createPublicClient,
  createWalletClient,
  http,
  Chain,
  parseEther,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { waitForTransactionReceipt } from 'viem/actions'
import { useWriteContract } from 'wagmi'
import { CallerMode } from '@/components/ContractCall/CallerSelector'

export interface CallResult {
  success: boolean
  data?: unknown
  txHash?: string
  receipt?: {
    status: 'success' | 'reverted'
    gasUsed: bigint
    blockNumber: bigint
  }
  error?: string
}

interface UseContractCallParams {
  selectedChain: Chain
  rpcUrl?: string
  contractAddress: `0x${string}`
  abi: any[]
  callerMode: CallerMode
  privateKey: string
  walletPublicClient: ReturnType<typeof createPublicClient>
}

export default function useContractCall({
  selectedChain,
  rpcUrl,
  contractAddress,
  abi,
  callerMode,
  privateKey,
  walletPublicClient,
}: UseContractCallParams) {
  const writeContract = useWriteContract()

  const getPublicClient = useCallback(() => {
    return createPublicClient({
      chain: selectedChain,
      transport: rpcUrl ? http(rpcUrl) : http(),
    })
  }, [selectedChain, rpcUrl])

  const getPrivateKeyWalletClient = useCallback(() => {
    if (!privateKey || !/^0x[0-9a-fA-F]{64}$/.test(privateKey.trim())) {
      throw new Error('私钥格式无效')
    }
    const account = privateKeyToAccount(privateKey.trim() as `0x${string}`)
    return {
      walletClient: createWalletClient({
        account,
        chain: selectedChain,
        transport: rpcUrl ? http(rpcUrl) : http(),
      }),
      account,
    }
  }, [privateKey, selectedChain, rpcUrl])

  /**
   * 调用只读方法（view/pure）
   */
  const callRead = useCallback(
    async (functionName: string, args: unknown[]): Promise<CallResult> => {
      try {
        const client = getPublicClient()
        const data = await client.readContract({
          address: contractAddress,
          abi,
          functionName,
          args,
        })
        return { success: true, data }
      } catch (err: any) {
        return {
          success: false,
          error: extractErrorMessage(err),
        }
      }
    },
    [getPublicClient, contractAddress, abi]
  )

  /**
   * 强制发送时使用的最大 gas limit。
   * 设置显式 gas 值可跳过 eth_estimateGas 的模拟估算，
   * 使合约在会 revert 的情况下也能强行上链。
   */
  const FORCE_GAS_LIMIT = BigInt(30_000_000)
  const maxGasLmit = useMemo(() => {
    if (selectedChain.id === 56) {
      return FORCE_GAS_LIMIT
    }
    if (selectedChain.id === 11155111) {
      return BigInt(1600_0000)
    }
    return FORCE_GAS_LIMIT
  }, [selectedChain.id])

  /**
   * 调用写入方法（nonpayable/payable）
   * @param options.force 为 true 时跳过 gas 估算，强制设置最大 gas limit 上链
   */
  const callWrite = useCallback(
    async (
      functionName: string,
      args: unknown[],
      ethValue?: string,
      options?: { force?: boolean }
    ): Promise<CallResult> => {
      const value = ethValue && ethValue !== '0' && ethValue !== ''
        ? parseEther(ethValue)
        : undefined
      const gas = options?.force ? maxGasLmit : undefined

      try {
        if (callerMode === 'wallet') {
          return await callWriteWithWallet(functionName, args, value, gas)
        } else {
          return await callWriteWithPrivateKey(functionName, args, value, gas)
        }
      } catch (err: any) {
        return {
          success: false,
          error: extractErrorMessage(err),
        }
      }
    },
    [callerMode, contractAddress, abi, writeContract, getPrivateKeyWalletClient, getPublicClient]
  )

  const callWriteWithWallet = async (
    functionName: string,
    args: unknown[],
    value?: bigint,
    gas?: bigint
  ): Promise<CallResult> => {
    const hash = await writeContract.mutateAsync({
      address: contractAddress,
      abi,
      functionName,
      args,
      ...(value !== undefined ? { value } : {}),
      ...(gas !== undefined ? { gas } : {}),
    })

    const publicClient = getPublicClient()
    const receipt = await waitForTransactionReceipt(publicClient, {
      hash,
      confirmations: 1,
      pollingInterval: 1500,
    })

    return {
      success: receipt.status === 'success',
      txHash: hash,
      receipt: {
        status: receipt.status,
        gasUsed: receipt.gasUsed,
        blockNumber: receipt.blockNumber,
      },
      error: receipt.status === 'reverted' ? '交易已上链但被 revert' : undefined,
    }
  }

  const callWriteWithPrivateKey = async (
    functionName: string,
    args: unknown[],
    value?: bigint,
    gas?: bigint
  ): Promise<CallResult> => {
    const { walletClient } = getPrivateKeyWalletClient()
    const publicClient = getPublicClient()

    const hash = await walletClient.writeContract({
      address: contractAddress,
      abi,
      functionName,
      args,
      ...(value !== undefined ? { value } : {}),
      ...(gas !== undefined ? { gas } : {}),
    })

    const receipt = await waitForTransactionReceipt(publicClient, {
      hash,
      confirmations: 1,
      pollingInterval: 1500,
    })

    return {
      success: receipt.status === 'success',
      txHash: hash,
      receipt: {
        status: receipt.status,
        gasUsed: receipt.gasUsed,
        blockNumber: receipt.blockNumber,
      },
      error: receipt.status === 'reverted' ? '交易已上链但被 revert' : undefined,
    }
  }

  return { callRead, callWrite }
}

function extractErrorMessage(err: any): string {
  if (!err) return '未知错误'

  // viem ContractFunctionRevertedError
  if (err.name === 'ContractFunctionRevertedError') {
    if (err.reason) return `Revert: ${err.reason}`
    if (err.data?.errorName) return `Revert: ${err.data.errorName}(${JSON.stringify(err.data.args || [])})`
    return 'Contract reverted without reason'
  }

  // UserRejectedRequestError
  if (err.name === 'UserRejectedRequestError' || err.code === 4001) {
    return '用户拒绝了交易请求'
  }

  // 通用 message
  if (err.shortMessage) return err.shortMessage
  if (err.message) {
    const msg = err.message
    // 截断超长 message
    return msg.length > 200 ? msg.slice(0, 200) + '...' : msg
  }

  return String(err)
}
