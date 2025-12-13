import styled from 'styled-components'

export const ToggleButton = styled.button<{ $isDark: boolean }>`
  position: relative;
  width: 60px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: ${props =>  props.theme.bg1};
  transition: background-color 0.3s ease;
  padding: 4px;
  display: flex;
  align-items: center;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.primary} 33;
  }
`

export const IconWrapper = styled.div<{ $isDark: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.theme.bg1};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: transform 0.3s ease;
  transform: translateX(${props => props.$isDark ? '28px' : '0'});
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`
