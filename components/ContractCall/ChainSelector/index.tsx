'use client'

import { useState } from 'react'
import { ChainOption, CustomChain } from '@/hooks/useChainManager'
import CustomChainModal from './CustomChainModal'
import {
  ChainSelectorWrapper,
  SelectorGroup,
  AddChainButton,
  ChainBadge,
  CustomChainList,
  CustomChainItem,
  ChainItemInfo,
  DeleteBtn,
  ModalForm,
  FormField,
  FormLabel,
  ModalFooter,
  CancelBtn,
  ConfirmBtn,
} from './style'
import CModal from '@/components/Basic/CModal'

interface Props {
  allChainOptions: ChainOption[]
  selectedChainId: number
  customChains: CustomChain[]
  onSelect: (chainId: number) => void
  onAddCustomChain: (chain: CustomChain) => void
  onRemoveCustomChain: (chainId: number) => void
}

export default function ChainSelector({
  allChainOptions,
  selectedChainId,
  customChains,
  onSelect,
  onAddCustomChain,
  onRemoveCustomChain,
}: Props) {
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [manageModalVisible, setManageModalVisible] = useState(false)

  const selectedOption = allChainOptions.find((c) => c.id === selectedChainId)

  return (
    <>
      <ChainSelectorWrapper>
        <SelectorGroup>
          <div style={{ position: 'relative', flex: 1 }}>
            <select
              value={selectedChainId}
              onChange={(e) => onSelect(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '9px 36px 9px 12px',
                borderRadius: 8,
                border: '1.5px solid #d0d5dd',
                fontSize: 13,
                color: '#101828',
                background: '#fff',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <optgroup label="预设链">
                {allChainOptions
                  .filter((c) => !c.isCustom)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Chain ID: {c.id})
                    </option>
                  ))}
              </optgroup>
              {customChains.length > 0 && (
                <optgroup label="自定义链">
                  {allChainOptions
                    .filter((c) => c.isCustom)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Chain ID: {c.id})
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
            <span
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#667085',
                fontSize: 12,
              }}
            >
              ▼
            </span>
          </div>
          {selectedOption?.isCustom && <ChainBadge $isCustom>自定义</ChainBadge>}
        </SelectorGroup>

        <AddChainButton onClick={() => setAddModalVisible(true)}>+ 添加自定义链</AddChainButton>

        {customChains.length > 0 && (
          <AddChainButton onClick={() => setManageModalVisible(true)}>管理自定义链</AddChainButton>
        )}
      </ChainSelectorWrapper>

      <CustomChainModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={onAddCustomChain}
        existingIds={allChainOptions.map((c) => c.id)}
      />

      <CModal
        visible={manageModalVisible}
        onClose={() => setManageModalVisible(false)}
        title="管理自定义链"
        width="480px"
      >
        <ModalForm>
          {customChains.length === 0 ? (
            <div style={{ color: '#98a2b3', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              暂无自定义链
            </div>
          ) : (
            <CustomChainList>
              {customChains.map((chain) => (
                <CustomChainItem key={chain.id}>
                  <ChainItemInfo>
                    <span className="chain-name">{chain.name}</span>
                    <span className="chain-id">
                      Chain ID: {chain.id} · {chain.symbol} · {chain.rpcUrl}
                    </span>
                  </ChainItemInfo>
                  <DeleteBtn onClick={() => onRemoveCustomChain(chain.id)}>删除</DeleteBtn>
                </CustomChainItem>
              ))}
            </CustomChainList>
          )}
          <FormField>
            <ModalFooter>
              <ConfirmBtn onClick={() => setManageModalVisible(false)}>关闭</ConfirmBtn>
            </ModalFooter>
          </FormField>
        </ModalForm>
      </CModal>
    </>
  )
}
