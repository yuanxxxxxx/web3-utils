'use client'

import { useState } from 'react'
import { ParsedMethod } from '@/utils/abi'
import { CallResult } from '@/hooks/useContractCall'
import MethodCard from './MethodCard'
import {
  MethodListWrapper,
  TabRow,
  Tab,
  TabBadge,
  MethodGrid,
  EmptyState,
} from './style'

interface Props {
  readMethods: ParsedMethod[]
  writeMethods: ParsedMethod[]
  contractReady: boolean
  callerReady: boolean
  explorerUrl?: (hash: string, type: 'tx' | 'address') => string
  onCall: (functionName: string, args: unknown[], ethValue?: string, options?: { force?: boolean }) => Promise<CallResult>
}

export default function MethodList({
  readMethods,
  writeMethods,
  contractReady,
  callerReady,
  explorerUrl,
  onCall,
}: Props) {
  const [activeTab, setActiveTab] = useState<'read' | 'write'>('read')

  const hasAbi = readMethods.length > 0 || writeMethods.length > 0
  const activeMethods = activeTab === 'read' ? readMethods : writeMethods

  if (!hasAbi) {
    return (
      <MethodListWrapper>
        <EmptyState>
          <span className="icon">📋</span>
          <span>解析 ABI 后，方法列表将在此显示</span>
        </EmptyState>
      </MethodListWrapper>
    )
  }

  return (
    <MethodListWrapper>
      <TabRow>
        <Tab $active={activeTab === 'read'} onClick={() => setActiveTab('read')}>
          Read Methods
          <TabBadge $type="read">{readMethods.length}</TabBadge>
        </Tab>
        <Tab $active={activeTab === 'write'} onClick={() => setActiveTab('write')}>
          Write Methods
          <TabBadge $type="write">{writeMethods.length}</TabBadge>
        </Tab>
      </TabRow>

      <MethodGrid>
        {activeMethods.length === 0 ? (
          <EmptyState>
            <span className="icon">{activeTab === 'read' ? '🔍' : '✏️'}</span>
            <span>该 ABI 没有 {activeTab === 'read' ? '只读' : '写入'} 方法</span>
          </EmptyState>
        ) : (
          activeMethods.map((method, idx) => (
            <MethodCard
              key={`${method.name}-${idx}`}
              method={method}
              contractReady={contractReady}
              callerReady={callerReady}
              explorerUrl={explorerUrl}
              onCall={onCall}
            />
          ))
        )}
      </MethodGrid>
    </MethodListWrapper>
  )
}
