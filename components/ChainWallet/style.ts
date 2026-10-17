import styled from 'styled-components'

export const ToolWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const PageHeader = styled.div`
  margin-bottom: 24px;
`

export const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #101828;
  margin: 0 0 6px;
`

export const PageSubtitle = styled.p`
  font-size: 13px;
  color: #667085;
  margin: 0;
  line-height: 1.6;
`

export const Panel = styled.section`
  background: #fff;
  border-radius: 12px;
  border: 1.5px solid #e4e7ec;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`

export const PanelTitle = styled.h2`
  font-size: 13px;
  font-weight: 700;
  color: #344054;
  margin: 0;
`

export const Warning = styled.div`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #fedf89;
  background: #fffaeb;
  color: #b54708;
  font-size: 12px;
  line-height: 1.6;
`

export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #344054;
`

export const MnemonicArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 88px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid #d0d5dd;
  font-size: 13px;
  font-family: 'Roboto', 'Courier New', monospace;
  color: #101828;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  background: #fff;

  &:focus {
    border-color: #667eff;
    box-shadow: 0 0 0 3px #667eff26;
  }

  &::placeholder {
    color: #98a2b3;
  }
`

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

export const PrimaryButton = styled.button`
  padding: 9px 16px;
  border-radius: 8px;
  border: none;
  background: #667eff;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #4f5fe8;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const SecondaryButton = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: 1.5px solid #d0d5dd;
  background: #fff;
  color: #344054;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #667eff;
    color: #667eff;
    background: #f0f3ff;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const GhostButton = styled.button`
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: #667085;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: #667eff;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const DeriveRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
`

export const CountField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const CountInput = styled.input`
  width: 120px;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1.5px solid #d0d5dd;
  font-size: 13px;
  color: #101828;
  outline: none;
  background: #fff;

  &:focus {
    border-color: #667eff;
    box-shadow: 0 0 0 3px #667eff26;
  }
`

export const Hint = styled.p`
  margin: 0;
  font-size: 12px;
  color: #667085;
  line-height: 1.5;
`

export const DirtyHint = styled(Hint)`
  color: #b54708;
`

export const ChainRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const SelectWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 240px;
`

export const ChainSelect = styled.select`
  width: 100%;
  padding: 9px 36px 9px 12px;
  border-radius: 8px;
  border: 1.5px solid #d0d5dd;
  font-size: 13px;
  color: #101828;
  background: #fff;
  cursor: pointer;
  outline: none;
  appearance: none;

  &:focus {
    border-color: #667eff;
    box-shadow: 0 0 0 3px #667eff26;
  }
`

export const SelectArrow = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #667085;
  font-size: 12px;
`

export const ChainMeta = styled.span`
  font-size: 12px;
  color: #667085;
  white-space: nowrap;
`

export const TokenInput = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1.5px solid #d0d5dd;
  font-size: 13px;
  font-family: 'Roboto', monospace;
  color: #101828;
  outline: none;
  background: #fff;

  &:focus {
    border-color: #667eff;
    box-shadow: 0 0 0 3px #667eff26;
  }

  &::placeholder {
    color: #98a2b3;
  }
`

export const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const TokenItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px solid #e4e7ec;
`

export const TokenMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  strong {
    font-size: 13px;
    color: #101828;
  }

  span {
    font-size: 12px;
    color: #667085;
    font-family: 'Roboto', monospace;
    word-break: break-all;
  }
`

export const SummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 8px;
  background: #f5f7ff;
  border: 1px solid #e0e7ff;
  font-size: 13px;
  color: #344054;
  line-height: 1.5;
`

export const AccountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const AccountCard = styled.article`
  border: 1.5px solid #e4e7ec;
  border-radius: 10px;
  background: #fff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const AccountHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

export const AccountIndex = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #101828;
`

export const AccountPath = styled.span`
  font-size: 12px;
  color: #667085;
  font-family: 'Roboto', monospace;
`

export const SecretRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`

export const SecretLabel = styled.span`
  flex-shrink: 0;
  width: 36px;
  padding-top: 2px;
  font-size: 12px;
  font-weight: 600;
  color: #667085;
`

export const SecretValue = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #101828;
  font-family: 'Roboto', monospace;
  word-break: break-all;
`

export const InlineLink = styled.a`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: #667eff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const BalanceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f9fafb;
`

export const BalanceLine = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
`

export const BalanceSymbol = styled.span`
  color: #667085;
  flex-shrink: 0;
`

export const BalanceAmount = styled.span<{ $error?: boolean }>`
  color: ${(props) => (props.$error ? '#f04438' : '#101828')};
  font-family: 'Roboto', monospace;
  text-align: right;
  word-break: break-all;
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 20px;
  color: #98a2b3;
  font-size: 14px;
  text-align: center;

  .icon {
    font-size: 36px;
    opacity: 0.45;
  }
`
