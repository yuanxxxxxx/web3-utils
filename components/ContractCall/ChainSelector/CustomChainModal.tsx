'use client'

import { useState } from 'react'
import CModal from '@/components/Basic/CModal'
import { CustomChain } from '@/hooks/useChainManager'
import {
  ModalForm,
  FormField,
  FormLabel,
  FormInput,
  FormError,
  FormHint,
  ModalFooter,
  CancelBtn,
  ConfirmBtn,
} from './style'

interface Props {
  visible: boolean
  onClose: () => void
  onAdd: (chain: CustomChain) => void
  existingIds: number[]
}

interface FormState {
  name: string
  chainId: string
  rpcUrl: string
  symbol: string
  explorerUrl: string
}

interface FormErrors {
  name?: string
  chainId?: string
  rpcUrl?: string
}

export default function CustomChainModal({ visible, onClose, onAdd, existingIds }: Props) {
  const [form, setForm] = useState<FormState>({
    name: '',
    chainId: '',
    rpcUrl: '',
    symbol: 'ETH',
    explorerUrl: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) {
      newErrors.name = '链名称不能为空'
    }
    const id = parseInt(form.chainId)
    if (!form.chainId || isNaN(id) || id <= 0) {
      newErrors.chainId = '请输入有效的 Chain ID（正整数）'
    } else if (existingIds.includes(id)) {
      newErrors.chainId = `Chain ID ${id} 已存在`
    }
    if (!form.rpcUrl.trim() || !/^https?:\/\/.+/.test(form.rpcUrl.trim())) {
      newErrors.rpcUrl = '请输入有效的 RPC URL（以 http:// 或 https:// 开头）'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirm = () => {
    if (!validate()) return
    onAdd({
      id: parseInt(form.chainId),
      name: form.name.trim(),
      rpcUrl: form.rpcUrl.trim(),
      symbol: form.symbol.trim() || 'ETH',
      explorerUrl: form.explorerUrl.trim() || undefined,
    })
    setForm({ name: '', chainId: '', rpcUrl: '', symbol: 'ETH', explorerUrl: '' })
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setForm({ name: '', chainId: '', rpcUrl: '', symbol: 'ETH', explorerUrl: '' })
    setErrors({})
    onClose()
  }

  return (
    <CModal visible={visible} onClose={handleClose} title="添加自定义链" width="480px">
      <ModalForm>
        <FormField>
          <FormLabel>链名称 *</FormLabel>
          <FormInput
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="如：MyChain"
            $error={!!errors.name}
          />
          {errors.name && <FormError>{errors.name}</FormError>}
        </FormField>

        <FormField>
          <FormLabel>Chain ID *</FormLabel>
          <FormInput
            value={form.chainId}
            onChange={(e) => update('chainId', e.target.value)}
            placeholder="如：1234"
            type="number"
            $error={!!errors.chainId}
          />
          {errors.chainId && <FormError>{errors.chainId}</FormError>}
        </FormField>

        <FormField>
          <FormLabel>RPC URL *</FormLabel>
          <FormInput
            value={form.rpcUrl}
            onChange={(e) => update('rpcUrl', e.target.value)}
            placeholder="https://rpc.example.com"
            $error={!!errors.rpcUrl}
          />
          {errors.rpcUrl && <FormError>{errors.rpcUrl}</FormError>}
        </FormField>

        <FormField>
          <FormLabel>原生代币符号</FormLabel>
          <FormInput
            value={form.symbol}
            onChange={(e) => update('symbol', e.target.value)}
            placeholder="ETH"
          />
          <FormHint>默认为 ETH</FormHint>
        </FormField>

        <FormField>
          <FormLabel>区块浏览器 URL</FormLabel>
          <FormInput
            value={form.explorerUrl}
            onChange={(e) => update('explorerUrl', e.target.value)}
            placeholder="https://explorer.example.com（选填）"
          />
        </FormField>

        <ModalFooter>
          <CancelBtn onClick={handleClose}>取消</CancelBtn>
          <ConfirmBtn onClick={handleConfirm}>添加</ConfirmBtn>
        </ModalFooter>
      </ModalForm>
    </CModal>
  )
}
