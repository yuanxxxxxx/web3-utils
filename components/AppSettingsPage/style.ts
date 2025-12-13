import styled from 'styled-components'

export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`

export const SettingsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.75rem;
`

export const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }
`

export const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const LabelText = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`

export const LabelDescription = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`

export const ToggleSwitch = styled.button<{ $active: boolean }>`
  width: 52px;
  height: 28px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  background-color: ${props => props.$active ? '#0070f3' : '#d1d5db'};

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.$active ? '26px' : '2px'};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    opacity: 0.9;
  }
`

export const Select = styled.select`
  padding: 5px 10px;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  background: white;
  color: #333;
  cursor: pointer;
`

export const StatusBadge = styled.div<{ $isDark: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => props.$isDark ? props.theme.bg1 : '#fef3c7'};
  color: ${props => props.$isDark ? props.theme.primary : '#92400e'};
`

