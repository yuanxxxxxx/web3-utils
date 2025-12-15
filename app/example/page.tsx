'use client'

import styled from 'styled-components'
import AppSettings from '@/components/AppSettingsPage'
import { useState } from 'react'
import CModal from '@/components/Basic/CModal'
import CTooltip from '@/components/Basic/CTooltip'
import Pagination from '@/components/Basic/Pagination'
import Dropdown from '@/components/Basic/Dropdown'
import { useReadContracts, useSendTransactionSync } from 'wagmi'
import { erc20Abi } from 'viem'
import useActiveWeb3React from '@/hooks/useActiveWeb3React'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { waitForTransactionReceipt } from 'viem/actions'
import toast from 'react-hot-toast'
import { fromValue, toValue } from '@/utils/format'

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 64px;
`

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
`
const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: bold;
  color: #333;
 
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`


export default function ExamplePage() {
  const [showModal, setShowModal] = useState(false)
  const { account, client } = useActiveWeb3React()
  const [amount, setAmount] = useState<string>('')

  const sepoliaUSDT = "0xCD046487465278cCE6D7eC0fE0F938eb14f5b21D"
  const spender = "0x0000000000000000000000000000000000000000"
  const [approveLoading, setApproveLoading] = useState(false)
  
  const { data, refetch } = useReadContracts({
    contracts: [
      {
        address: sepoliaUSDT,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [account as `0x${string}`, spender],
      },
      {
        address: sepoliaUSDT,
        abi: erc20Abi,
        functionName: 'decimals',
        args: [],
      },
    ],
    query: {
      enabled: !!account,
    },
  });

  const allowance = String(data?.[0]?.result as bigint || 0)
  const decimals = Number(data?.[1]?.result as number || 0)
  const writeContract = useWriteContract()

  const onApprove = async () => {
    if (!amount) {
      toast.error('Please enter the amount', { id: `amount` });
      return
    }
    setApproveLoading(true)
    try {
      
    const hash = await writeContract.mutateAsync({
      address: sepoliaUSDT as `0x${string}`,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, BigInt(toValue(amount, decimals))],
    });

    // 等待交易确认
    const receipt = await waitForTransactionReceipt(client, {
      hash,
      confirmations: 1,
      pollingInterval: 1000,
    });

    if (receipt.status === 'success') {
      toast.success('Approve successfully!', { id: `approve` });
    }
    } catch (error) {
      
    } finally {
      setApproveLoading(false)
    }
  }
  const onQueryAllowance = () => {
    refetch()
  }
  return (
    <PageContainer>
      <Main>
        <SectionTitle>⚙️ 应用设置 & 用户信息</SectionTitle>
        <Grid>
          <AppSettings />
        </Grid>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={onApprove} disabled={approveLoading}>{approveLoading ? 'Approveing...' : 'Approve'}</button>
        <button onClick={onQueryAllowance}>Query Allowance</button>
        <p>Allowance: {fromValue(allowance, decimals, 4)}</p>
        <button onClick={() => setShowModal(true)}>Open Modal</button>
        <CTooltip overlay="Tooltip" strokeColor="#000" />
        <Pagination current={1} total={100} pageSize={10} onChange={() => {}} />
        <Dropdown value="1" options={[{label: '1', value: '1'}, {label: '2', value: '2'}]} onChange={() => {}} />
        <CModal visible={showModal} onClose={() => setShowModal(false)} title="Modal"> 
          <div>Modal</div>
        </CModal>
      </Main>
    </PageContainer>
  );
}

