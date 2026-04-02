import styled from 'styled-components'

export const ContractInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #344054;
`

export const AddressInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const StyledInput = styled.input<{ $error?: boolean; $valid?: boolean }>`
  flex: 1;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1.5px solid ${(p) => (p.$error ? '#f04438' : p.$valid ? '#12b76a' : '#d0d5dd')};
  font-size: 13px;
  color: #101828;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
  font-family: 'Roboto', monospace;

  &:focus {
    border-color: ${(p) => (p.$error ? '#f04438' : '#667eff')};
    box-shadow: 0 0 0 3px ${(p) => (p.$error ? '#fee4e226' : '#667eff26')};
  }

  &::placeholder {
    color: #98a2b3;
    font-family: inherit;
  }
`

export const FieldHint = styled.div<{ $type?: 'error' | 'success' | 'info' }>`
  font-size: 11px;
  color: ${(p) =>
    p.$type === 'error' ? '#f04438' : p.$type === 'success' ? '#12b76a' : '#667085'};
`

export const AbiInputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AbiActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const StyledTextarea = styled.textarea<{ $error?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  min-height: 160px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid ${(p) => (p.$error ? '#f04438' : '#d0d5dd')};
  font-size: 12px;
  font-family: 'Roboto', 'Courier New', monospace;
  color: #101828;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
  background: #fafafa;
  line-height: 1.6;

  &:focus {
    border-color: ${(p) => (p.$error ? '#f04438' : '#667eff')};
    box-shadow: 0 0 0 3px ${(p) => (p.$error ? '#fee4e226' : '#667eff26')};
    background: #fff;
  }

  &::placeholder {
    color: #98a2b3;
  }
`

export const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1.5px solid #d0d5dd;
  background: #fff;
  font-size: 12px;
  color: #344054;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    border-color: #667eff;
    color: #667eff;
    background: #f0f3ff;
  }
`

export const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1.5px solid #fee4e2;
  background: #fff;
  font-size: 12px;
  color: #f04438;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fee4e2;
  }
`

export const ParseStatusBadge = styled.div<{ $type: 'success' | 'error' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${(p) => (p.$type === 'success' ? '#d1fae5' : '#fee4e2')};
  color: ${(p) => (p.$type === 'success' ? '#065f46' : '#b42318')};
`

export const AbiQuickRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`

export const AbiQuickLabel = styled.span`
  font-size: 11px;
  color: #667085;
  white-space: nowrap;
`

export const AbiQuickBtn = styled.button<{ $variant?: 'erc20' | 'erc721' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1.5px solid ${(p) => (p.$variant === 'erc721' ? '#7c3aed' : '#0ea5e9')};
  background: ${(p) => (p.$variant === 'erc721' ? '#f5f3ff' : '#f0f9ff')};
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => (p.$variant === 'erc721' ? '#7c3aed' : '#0369a1')};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    background: ${(p) => (p.$variant === 'erc721' ? '#ede9fe' : '#e0f2fe')};
    border-color: ${(p) => (p.$variant === 'erc721' ? '#6d28d9' : '#0284c7')};
  }
`
