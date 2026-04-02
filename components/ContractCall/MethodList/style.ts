import styled from 'styled-components'

export const MethodListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

export const TabRow = styled.div`
  display: flex;
  border-bottom: 2px solid #e4e7ec;
  margin-bottom: 20px;
`

export const Tab = styled.button<{ $active?: boolean }>`
  padding: 10px 22px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: ${(p) => (p.$active ? '600' : '400')};
  color: ${(p) => (p.$active ? '#667eff' : '#667085')};
  cursor: pointer;
  position: relative;
  transition: color 0.2s;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(p) => (p.$active ? '#667eff' : 'transparent')};
    border-radius: 2px 2px 0 0;
    transition: background 0.2s;
  }

  &:hover {
    color: ${(p) => (p.$active ? '#667eff' : '#344054')};
  }
`

export const TabBadge = styled.span<{ $type?: 'read' | 'write' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 7px;
  background: ${(p) => (p.$type === 'read' ? '#d1fae5' : '#fee4e2')};
  color: ${(p) => (p.$type === 'read' ? '#065f46' : '#b42318')};
`

export const MethodGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #98a2b3;
  font-size: 14px;
  gap: 8px;
  text-align: center;

  .icon {
    font-size: 40px;
    opacity: 0.4;
  }
`

// --- MethodCard styles ---

export const CardWrapper = styled.div`
  border: 1.5px solid #e4e7ec;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`

export const CardHeader = styled.div<{ $type?: 'read' | 'write' | 'payable' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: ${(p) =>
    p.$type === 'payable' ? '#fffaeb' : p.$type === 'write' ? '#fff7ed' : '#f0fdf4'};
  border-bottom: 1px solid #e4e7ec;
  cursor: pointer;
  user-select: none;
`

export const FunctionName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #101828;
  font-family: 'Roboto', monospace;
`

export const MutabilityBadge = styled.span<{ $type: 'view' | 'pure' | 'nonpayable' | 'payable' }>`
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${(p) => {
    if (p.$type === 'view') return '#d1fae5'
    if (p.$type === 'pure') return '#d1fae5'
    if (p.$type === 'payable') return '#fef3c7'
    return '#fee4e2'
  }};
  color: ${(p) => {
    if (p.$type === 'view') return '#065f46'
    if (p.$type === 'pure') return '#065f46'
    if (p.$type === 'payable') return '#92400e'
    return '#b42318'
  }};
`

export const CollapseIcon = styled.span<{ $open?: boolean }>`
  margin-left: auto;
  color: #98a2b3;
  font-size: 12px;
  transform: ${(p) => (p.$open ? 'rotate(180deg)' : 'rotate(0)')};
  transition: transform 0.2s;
`

export const CardBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const InputsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const InputLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #344054;
  display: flex;
  align-items: center;
  gap: 6px;
`

export const TypeTag = styled.span`
  font-size: 10px;
  font-weight: 400;
  color: #667085;
  font-family: 'Roboto', monospace;
  background: #f2f4f7;
  padding: 1px 6px;
  border-radius: 4px;
`

export const MethodInput = styled.input<{ $error?: boolean }>`
  padding: 8px 11px;
  border-radius: 7px;
  border: 1.5px solid ${(p) => (p.$error ? '#f04438' : '#d0d5dd')};
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

export const ArrayInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const ArrayItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const ArrayItemIndex = styled.span`
  font-size: 11px;
  color: #98a2b3;
  min-width: 24px;
`

export const AddItemBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px dashed #d0d5dd;
  background: transparent;
  color: #667085;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  width: fit-content;

  &:hover {
    border-color: #667eff;
    color: #667eff;
  }
`

export const RemoveItemBtn = styled.button`
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
  background: #fee4e2;
  color: #f04438;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background: #fda29b;
  }
`

export const EthValueSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: #fffaeb;
  border-radius: 8px;
  border: 1px solid #fde68a;
`

export const EthValueLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #92400e;
`

export const EthValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const EthValueInput = styled(MethodInput)`
  flex: 1;
  border-color: #fde68a;

  &:focus {
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px #fef3c726;
  }
`

export const EthUnit = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #92400e;
`

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const QueryBtn = styled.button`
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  background: #12b76a;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #0e9d5a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const SendBtn = styled.button`
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  background: #667eff;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4f5fe8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ForceSendBtn = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid #f79009;
  background: #fffaeb;
  color: #b54708;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background: #fef0c7;
    border-color: #dc6803;
    color: #93370d;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ForceTip = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 7px;
  background: #fffaeb;
  border: 1px solid #fec84b;
  font-size: 11px;
  color: #92400e;
  line-height: 1.5;
  margin-top: 4px;
`

export const ResultSection = styled.div<{ $type?: 'success' | 'error' }>`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${(p) => (p.$type === 'error' ? '#fda29b' : '#a9d6b8')};
`

export const ResultHeader = styled.div<{ $type?: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 12px;
  background: ${(p) => (p.$type === 'error' ? '#fee4e2' : '#d1fae5')};
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => (p.$type === 'error' ? '#b42318' : '#065f46')};
`

export const ResultBody = styled.pre`
  margin: 0;
  padding: 10px 12px;
  background: #f9fafb;
  font-size: 12px;
  font-family: 'Roboto', 'Courier New', monospace;
  color: #344054;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 220px;
  overflow-y: auto;
  line-height: 1.6;
`

export const TxHashLink = styled.a`
  font-size: 12px;
  font-family: 'Roboto', monospace;
  color: #667eff;
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: #4f5fe8;
  }
`

export const TxMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 8px 12px;
  background: #f9fafb;
  border-top: 1px solid #e4e7ec;
`

export const TxMetaItem = styled.div`
  font-size: 11px;
  color: #667085;

  strong {
    color: #344054;
  }
`

export const LoadingSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`
