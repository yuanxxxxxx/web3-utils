'use client'

import { useState } from 'react'
import { ParsedMethod, AbiInput, getInputPlaceholder, parseInputValue, formatOutputValue } from '@/utils/abi'
import { CallResult } from '@/hooks/useContractCall'
import {
  CardWrapper,
  CardHeader,
  FunctionName,
  MutabilityBadge,
  CollapseIcon,
  CardBody,
  InputsSection,
  InputRow,
  InputLabel,
  TypeTag,
  MethodInput,
  ArrayInputContainer,
  ArrayItemRow,
  ArrayItemIndex,
  AddItemBtn,
  RemoveItemBtn,
  EthValueSection,
  EthValueLabel,
  EthValueRow,
  EthValueInput,
  EthUnit,
  ActionRow,
  QueryBtn,
  SendBtn,
  ForceSendBtn,
  ForceTip,
  ResultSection,
  ResultHeader,
  ResultBody,
  TxHashLink,
  TxMeta,
  TxMetaItem,
  LoadingSpinner,
} from './style'

interface MethodCardProps {
  method: ParsedMethod
  contractReady: boolean
  callerReady: boolean
  explorerUrl?: (hash: string, type: 'tx' | 'address') => string
  onCall: (
    functionName: string,
    args: unknown[],
    ethValue?: string,
    options?: { force?: boolean }
  ) => Promise<CallResult>
}

// 单个参数的输入控件
function ParameterInput({
  input,
  value,
  onChange,
}: {
  input: AbiInput
  value: string
  onChange: (v: string) => void
}) {
  const isArray = input.type.endsWith(']')
  const isBool = input.type === 'bool'

  if (isArray) {
    let items: string[] = []
    try {
      items = JSON.parse(value || '[]')
      if (!Array.isArray(items)) items = []
    } catch {
      items = value ? value.split(',').map((s) => s.trim()) : []
    }
    if (items.length === 0) items = ['']

    const setItems = (newItems: string[]) => {
      onChange(JSON.stringify(newItems))
    }

    const baseType = input.type.replace(/\[\d*\]$/, '')

    return (
      <ArrayInputContainer>
        {items.map((item, idx) => (
          <ArrayItemRow key={idx}>
            <ArrayItemIndex>[{idx}]</ArrayItemIndex>
            <MethodInput
              value={item}
              onChange={(e) => {
                const updated = [...items]
                updated[idx] = e.target.value
                setItems(updated)
              }}
              placeholder={getInputPlaceholder(baseType)}
            />
            <RemoveItemBtn
              onClick={() => setItems(items.filter((_, i) => i !== idx))}
            >
              ✕
            </RemoveItemBtn>
          </ArrayItemRow>
        ))}
        <AddItemBtn onClick={() => setItems([...items, ''])}>+ 添加元素</AddItemBtn>
      </ArrayInputContainer>
    )
  }

  if (isBool) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '8px 11px',
          borderRadius: 7,
          border: '1.5px solid #d0d5dd',
          fontSize: 12,
          color: '#101828',
          background: '#fff',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="false">false</option>
        <option value="true">true</option>
      </select>
    )
  }

  return (
    <MethodInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={getInputPlaceholder(input.type)}
    />
  )
}

export default function MethodCard({
  method,
  contractReady,
  callerReady,
  explorerUrl,
  onCall,
}: MethodCardProps) {
  const [open, setOpen] = useState(true)
  const [inputValues, setInputValues] = useState<string[]>(
    method.inputs.map((inp) => (inp.type === 'bool' ? 'false' : ''))
  )
  const [ethValue, setEthValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [forceLoading, setForceLoading] = useState(false)
  const [result, setResult] = useState<CallResult | null>(null)
  const [isForceResult, setIsForceResult] = useState(false)

  const isRead = method.isReadOnly
  const isPayable = method.stateMutability === 'payable'

  const cardType = isPayable ? 'payable' : isRead ? 'read' : 'write'

  const setInputAt = (idx: number, val: string) => {
    setInputValues((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }

  const parseArgs = (): unknown[] => {
    return method.inputs.map((input, idx) => {
      try {
        return parseInputValue(inputValues[idx] ?? '', input.type)
      } catch {
        return inputValues[idx] ?? ''
      }
    })
  }

  const handleCall = async () => {
    setLoading(true)
    setIsForceResult(false)
    setResult(null)
    try {
      const args = parseArgs()
      const res = await onCall(method.name, args, isPayable ? ethValue : undefined)
      setResult(res)
    } finally {
      setLoading(false)
    }
  }

  const handleForceCall = async () => {
    setForceLoading(true)
    setIsForceResult(true)
    setResult(null)
    try {
      const args = parseArgs()
      const res = await onCall(method.name, args, isPayable ? ethValue : undefined, { force: true })
      setResult(res)
    } finally {
      setForceLoading(false)
    }
  }

  const canCall = contractReady && (isRead || callerReady)
  const anyLoading = loading || forceLoading

  const formatResult = (): string => {
    if (!result) return ''
    if (!result.success) return result.error || '调用失败'
    if (result.data !== undefined) {
      if (method.outputs.length === 1) {
        return formatOutputValue(result.data, method.outputs[0].type)
      }
      if (Array.isArray(result.data)) {
        return method.outputs
          .map((out, idx) => {
            const label = out.name ? `${out.name} (${out.type})` : `[${idx}] (${out.type})`
            return `${label}: ${formatOutputValue((result.data as unknown[])[idx], out.type)}`
          })
          .join('\n')
      }
      return formatOutputValue(result.data, '')
    }
    return ''
  }

  return (
    <CardWrapper>
      <CardHeader $type={cardType} onClick={() => setOpen((p) => !p)}>
        <FunctionName>{method.name}</FunctionName>
        <MutabilityBadge $type={method.stateMutability}>
          {method.stateMutability}
        </MutabilityBadge>
        {method.inputs.length > 0 && (
          <span style={{ fontSize: 11, color: '#667085' }}>
            {method.inputs.length} 个参数
          </span>
        )}
        {method.outputs.length > 0 && isRead && (
          <span style={{ fontSize: 11, color: '#667085' }}>
            → {method.outputs.map((o) => o.type).join(', ')}
          </span>
        )}
        <CollapseIcon $open={open}>▼</CollapseIcon>
      </CardHeader>

      {open && (
        <CardBody>
          {method.inputs.length > 0 && (
            <InputsSection>
              {method.inputs.map((input, idx) => (
                <InputRow key={idx}>
                  <InputLabel>
                    {input.name || `param${idx}`}
                    <TypeTag>{input.type}</TypeTag>
                  </InputLabel>
                  <ParameterInput
                    input={input}
                    value={inputValues[idx] ?? ''}
                    onChange={(v) => setInputAt(idx, v)}
                  />
                </InputRow>
              ))}
            </InputsSection>
          )}

          {isPayable && (
            <EthValueSection>
              <EthValueLabel>发送 ETH (payable)</EthValueLabel>
              <EthValueRow>
                <EthValueInput
                  value={ethValue}
                  onChange={(e) => setEthValue(e.target.value)}
                  placeholder="0.0"
                  type="text"
                />
                <EthUnit>ETH</EthUnit>
              </EthValueRow>
            </EthValueSection>
          )}

          <ActionRow>
            {isRead ? (
              <QueryBtn onClick={handleCall} disabled={!canCall || anyLoading}>
                {loading ? <><LoadingSpinner /> &nbsp;查询中...</> : '查询'}
              </QueryBtn>
            ) : (
              <>
                <SendBtn onClick={handleCall} disabled={!canCall || anyLoading}>
                  {loading ? <><LoadingSpinner /> &nbsp;发送中...</> : '发送交易'}
                </SendBtn>
                <ForceSendBtn onClick={handleForceCall} disabled={!canCall || anyLoading}>
                  {forceLoading ? <><LoadingSpinner /> &nbsp;强制发送中...</> : '⚡ 强制发送交易'}
                </ForceSendBtn>
              </>
            )}
            {!contractReady && (
              <span style={{ fontSize: 12, color: '#f04438' }}>请先填写合约地址和 ABI</span>
            )}
            {contractReady && !isRead && !callerReady && (
              <span style={{ fontSize: 12, color: '#f59e0b' }}>请先连接钱包或输入私钥</span>
            )}
            {result && (
              <button
                onClick={() => setResult(null)}
                style={{
                  marginLeft: 'auto',
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid #d0d5dd',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 11,
                  color: '#667085',
                }}
              >
                清空结果
              </button>
            )}
          </ActionRow>
          {!isRead && (
            <ForceTip>
              ⚡ <span><strong>强制发送交易</strong>：跳过 gas 估算模拟，设置 Gas Limit = 30,000,000 强行上链。即使合约会 revert，交易也会被广播到网络并消耗 gas。</span>
            </ForceTip>
          )}

          {result && (
            <ResultSection $type={result.success ? 'success' : 'error'}>
              <ResultHeader $type={result.success ? 'success' : 'error'}>
                {result.success ? '✓ 成功' : '✗ 失败'}
                {isForceResult && (
                  <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 8, opacity: 0.8 }}>
                    ⚡ 强制发送
                  </span>
                )}
              </ResultHeader>
              {result.txHash && (
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #e4e7ec' }}>
                  <div style={{ fontSize: 11, color: '#667085', marginBottom: 4 }}>
                    交易哈希：
                  </div>
                  {explorerUrl ? (
                    <TxHashLink
                      href={explorerUrl(result.txHash, 'tx')}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {result.txHash}
                    </TxHashLink>
                  ) : (
                    <span style={{ fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {result.txHash}
                    </span>
                  )}
                </div>
              )}
              {result.data !== undefined && (
                <ResultBody>{formatResult()}</ResultBody>
              )}
              {result.error && !result.txHash && (
                <ResultBody>{result.error}</ResultBody>
              )}
              {result.receipt && (
                <TxMeta>
                  <TxMetaItem>
                    状态：<strong>{result.receipt.status === 'success' ? '✓ 成功' : '✗ Reverted'}</strong>
                  </TxMetaItem>
                  <TxMetaItem>
                    Gas 消耗：<strong>{result.receipt.gasUsed.toString()}</strong>
                  </TxMetaItem>
                  <TxMetaItem>
                    区块号：<strong>{result.receipt.blockNumber.toString()}</strong>
                  </TxMetaItem>
                </TxMeta>
              )}
            </ResultSection>
          )}
        </CardBody>
      )}
    </CardWrapper>
  )
}
