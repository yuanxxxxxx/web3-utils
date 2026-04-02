import styled from 'styled-components'

export const CallerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const ModeToggle = styled.div`
  display: flex;
  gap: 0;
  border-radius: 8px;
  border: 1.5px solid #d0d5dd;
  overflow: hidden;
  width: fit-content;
`

export const ModeTab = styled.button<{ $active?: boolean }>`
  padding: 8px 18px;
  border: none;
  background: ${(p) => (p.$active ? '#667eff' : '#fff')};
  color: ${(p) => (p.$active ? '#fff' : '#667085')};
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${(p) => (p.$active ? '#667eff' : '#f9fafb')};
  }
`

export const WalletPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid #e4e7ec;
`

export const WalletAddress = styled.span`
  font-family: 'Roboto', monospace;
  font-size: 13px;
  color: #344054;
  flex: 1;
`

export const ConnectBtn = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  border: 1.5px solid #667eff;
  background: #667eff;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4f5fe8;
  }
`

export const DisconnectBtn = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1.5px solid #d0d5dd;
  background: #fff;
  color: #667085;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #f04438;
    color: #f04438;
  }
`

export const ChainMismatchAlert = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fffaeb;
  border: 1px solid #fec84b;
`

export const AlertText = styled.span`
  font-size: 12px;
  color: #92400e;
  flex: 1;
`

export const SwitchChainBtn = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #f59e0b;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: #d97706;
  }
`

export const PrivateKeyPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const PrivateKeyRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`

export const PrivateKeyInput = styled.input<{ $error?: boolean; $valid?: boolean }>`
  flex: 1;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1.5px solid ${(p) => (p.$error ? '#f04438' : p.$valid ? '#12b76a' : '#d0d5dd')};
  font-size: 12px;
  font-family: 'Roboto', monospace;
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

export const DerivedAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
`

export const DerivedLabel = styled.span`
  font-size: 11px;
  color: #15803d;
  white-space: nowrap;
`

export const DerivedAddressText = styled.span`
  font-size: 12px;
  font-family: 'Roboto', monospace;
  color: #065f46;
  word-break: break-all;
`

export const SecurityTip = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  font-size: 11px;
  color: #1d4ed8;
  line-height: 1.5;
`

export const FieldHint = styled.div<{ $type?: 'error' | 'success' | 'info' }>`
  font-size: 11px;
  color: ${(p) =>
    p.$type === 'error' ? '#f04438' : p.$type === 'success' ? '#12b76a' : '#667085'};
`
