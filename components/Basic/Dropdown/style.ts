import styled from 'styled-components';

export const DropdownContainer = styled.div<{ $fullWidth?: boolean; $minimal?: boolean }>`
  position: relative;
  width: ${({ $fullWidth, $minimal }) => 
    $minimal ? 'auto' : ($fullWidth ? '100%' : 'auto')};
  min-width: ${({ $minimal }) => $minimal ? 'auto' : '160px'};

  @media (max-width: 768px) {
    width: ${({ $fullWidth, $minimal }) => 
      $minimal ? 'auto' : ($fullWidth ? '100%' : 'auto')};
    min-width: ${({ $fullWidth, $minimal }) => 
      $minimal ? 'auto' : ($fullWidth ? 'auto' : '160px')};
  }
`;

export const DropdownButton = styled.div<{ $showMenu?: boolean; $minimal?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ $minimal }) => $minimal ? '6px' : '8px'};
  padding: ${({ $minimal }) => $minimal ? '8px 12px' : '10px 14px'};
  background: ${({ theme, $minimal }) => $minimal ? 'transparent' : theme.inputBg};
  border: 1px solid ${({ $showMenu, theme, $minimal }) => 
    $minimal ? 'transparent' : ($showMenu ? theme.inputBorder : 'transparent')};
  border-radius: ${({ $minimal }) => $minimal ? '8px' : '10px'};
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: ${({ theme, $minimal }) => $minimal ? 'transparent' : theme.inputBorder};
    background: ${({ $minimal }) => $minimal ? 'transparent' : '#ffffff'};
  }
  
  span {
    flex: 1;
    font-size: 14px;
    font-weight: ${({ $minimal }) => $minimal ? '600' : '500'};
    color: ${props => props.theme.text1};
    line-height: 100%;
    white-space: nowrap;
  }
`;

export const DropdownMenu = styled.div<{ $showMenu: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  left: 0;
  margin-top: 4px;
  cursor: default;
  opacity: ${({ $showMenu }) => $showMenu ? 1 : 0};
  max-height: ${({ $showMenu }) => $showMenu ? '600px' : '0'};
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  z-index: 100;
  
  .dropdown-menu-box {
    width: 100%;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.border};
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const DropdownMenuItem = styled.div<{ $active?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  color: ${({ $active, theme }) => $active ? theme.text1 : theme.text2};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background: ${({ $active, theme }) => $active ? theme.hover1 : 'transparent'};
  
  &:hover {
    background: ${props => props.theme.hover1};
    color: ${props => props.theme.text1};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.border};
  }
`;

