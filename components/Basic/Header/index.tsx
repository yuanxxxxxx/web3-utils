'use client'

import { usePathname } from 'next/navigation'
import { HeaderContainer, Nav, Logo, NavLinks, NavLink, WalletButtonWrapper } from './style'
import useActiveWeb3React from '@/hooks/useActiveWeb3React'
import { toFormatAccount } from '@/utils/format'

export default function Header() {
  const pathname = usePathname()
  const { openConnectModal, account, loginOut } = useActiveWeb3React()
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
           {account ? <div>
            {toFormatAccount(account)}
            <button onClick={loginOut}>Logout</button>
           </div> : <button onClick={openConnectModal}>Connect Wallet</button>}
        </WalletButtonWrapper>
      </Nav>
    </HeaderContainer>
  )
}

