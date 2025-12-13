'use client'

import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { HeaderContainer, Nav, Logo, NavLinks, NavLink, WalletButtonWrapper } from './style'

export default function Header() {
  const pathname = usePathname()

  return (
    <HeaderContainer>
      <Nav>
        <Logo>Next App</Logo>
        <NavLinks>
          <NavLink href="/" $active={pathname === '/'}>
            Home
          </NavLink>
          <NavLink href="/example" $active={pathname === '/example'}>
            Example
          </NavLink>
          <NavLink href="/test" $active={pathname === '/test'}>
            Test
          </NavLink>
        </NavLinks>
        <WalletButtonWrapper>
          <ConnectButton />
        </WalletButtonWrapper>
      </Nav>
    </HeaderContainer>
  )
}

