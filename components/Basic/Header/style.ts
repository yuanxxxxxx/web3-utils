import styled from 'styled-components'
import Link from 'next/link'

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: ${props => props.theme.bg1};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
`

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.primary};
  margin-right: auto;
  transition: color 0.3s ease;
`

export const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`

export const NavLink = styled(Link)<{ $active?: boolean }>`
  text-decoration: none;
  color: ${props => props.theme.primary};
  font-weight: ${props => props.$active 
    ? '700' 
    : '500'};
    
    
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
      color: ${props => props.theme.primary};
    background-color: ${props => props.theme.bg1};
  }

  ${props => props.$active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${props.theme.primary};
    }
  `}
`

export const WalletButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`

