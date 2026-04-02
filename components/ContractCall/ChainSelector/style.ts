import styled from 'styled-components'

export const ChainSelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const SelectorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 240px;
`

export const AddChainButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px dashed #d0d5dd;
  background: transparent;
  color: #667085;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    border-color: #667eff;
    color: #667eff;
    background: #f0f3ff;
  }
`

export const ChainBadge = styled.span<{ $isCustom?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 500;
  background: ${(p) => (p.$isCustom ? '#fef3c7' : '#e0f2fe')};
  color: ${(p) => (p.$isCustom ? '#92400e' : '#0369a1')};
  margin-left: 6px;
`

export const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 8px 0;
`

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

export const FormLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #344054;
`

export const FormInput = styled.input<{ $error?: boolean }>`
  padding: 9px 12px;
  border-radius: 8px;
  border: 1.5px solid ${(p) => (p.$error ? '#f04438' : '#d0d5dd')};
  font-size: 13px;
  color: #101828;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;

  &:focus {
    border-color: ${(p) => (p.$error ? '#f04438' : '#667eff')};
    box-shadow: 0 0 0 3px ${(p) => (p.$error ? '#fee4e226' : '#667eff26')};
  }

  &::placeholder {
    color: #98a2b3;
  }
`

export const FormError = styled.span`
  font-size: 11px;
  color: #f04438;
`

export const FormHint = styled.span`
  font-size: 11px;
  color: #98a2b3;
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
`

export const CancelBtn = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  border: 1.5px solid #d0d5dd;
  background: #fff;
  font-size: 13px;
  color: #344054;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
  }
`

export const ConfirmBtn = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  background: #667eff;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #4f5fe8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const CustomChainList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
`

export const CustomChainItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid #e4e7ec;
`

export const ChainItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .chain-name {
    font-size: 13px;
    font-weight: 600;
    color: #101828;
  }

  .chain-id {
    font-size: 11px;
    color: #667085;
  }
`

export const DeleteBtn = styled.button`
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
  background: #fee4e2;
  color: #f04438;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fda29b;
  }
`
