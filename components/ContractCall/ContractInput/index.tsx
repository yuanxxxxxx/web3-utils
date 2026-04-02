'use client'

import { useRef } from 'react'
import { isAddress } from 'viem'
import { ERC20_ABI, ERC721_ABI } from '@/utils/abis'
import {
  ContractInputWrapper,
  FieldGroup,
  FieldLabel,
  AddressInputRow,
  StyledInput,
  FieldHint,
  AbiInputArea,
  AbiActionRow,
  StyledTextarea,
  UploadButton,
  ClearButton,
  ParseStatusBadge,
  AbiQuickRow,
  AbiQuickLabel,
  AbiQuickBtn,
} from './style'

interface Props {
  contractAddress: string
  onAddressChange: (value: string) => void
  abiString: string
  onAbiChange: (value: string) => void
  parseError: string | null
  totalMethods: number
}

export default function ContractInput({
  contractAddress,
  onAddressChange,
  abiString,
  onAbiChange,
  parseError,
  totalMethods,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isValidAddress = contractAddress.length > 0 && isAddress(contractAddress)
  const isInvalidAddress = contractAddress.length > 0 && !isAddress(contractAddress)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      onAbiChange(text)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const hasAbi = abiString.trim().length > 0
  const showParseSuccess = hasAbi && !parseError && totalMethods > 0
  const showParseError = hasAbi && !!parseError

  return (
    <ContractInputWrapper>
      <FieldGroup>
        <FieldLabel>合约地址</FieldLabel>
        <AddressInputRow>
          <StyledInput
            value={contractAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="0x..."
            $error={isInvalidAddress}
            $valid={isValidAddress}
            spellCheck={false}
          />
        </AddressInputRow>
        {isInvalidAddress && (
          <FieldHint $type="error">地址格式无效，请输入正确的以太坊地址</FieldHint>
        )}
        {isValidAddress && (
          <FieldHint $type="success">✓ 地址格式正确</FieldHint>
        )}
      </FieldGroup>

      <FieldGroup>
        <FieldLabel>ABI</FieldLabel>
        <AbiInputArea>
          <AbiActionRow>
            <UploadButton>
              📂 上传 JSON 文件
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </UploadButton>
            {hasAbi && (
              <ClearButton onClick={() => onAbiChange('')}>✕ 清空</ClearButton>
            )}
            {showParseSuccess && (
              <ParseStatusBadge $type="success">
                ✓ 解析成功，共 {totalMethods} 个方法
              </ParseStatusBadge>
            )}
            {showParseError && (
              <ParseStatusBadge $type="error">✗ 解析失败</ParseStatusBadge>
            )}
          </AbiActionRow>
          <AbiQuickRow>
            <AbiQuickLabel>快速填充：</AbiQuickLabel>
            <AbiQuickBtn
              $variant="erc20"
              onClick={() => onAbiChange(JSON.stringify(ERC20_ABI, null, 2))}
            >
              ERC20
            </AbiQuickBtn>
            <AbiQuickBtn
              $variant="erc721"
              onClick={() => onAbiChange(JSON.stringify(ERC721_ABI, null, 2))}
            >
              ERC721
            </AbiQuickBtn>
          </AbiQuickRow>
          <StyledTextarea
            value={abiString}
            onChange={(e) => onAbiChange(e.target.value)}
            placeholder={`粘贴 ABI JSON，支持：
• 纯 ABI 数组：[{"type":"function",...}]
• Hardhat/Foundry artifact：{"abi":[...],...}`}
            $error={showParseError}
            spellCheck={false}
          />
          {showParseError && (
            <FieldHint $type="error">{parseError}</FieldHint>
          )}
        </AbiInputArea>
      </FieldGroup>
    </ContractInputWrapper>
  )
}
