'use client'

import { usePathname } from 'next/navigation'
import { HeaderContainer, Nav, Logo, NavLinks, NavLink, WalletButtonWrapper } from './style'
import useActiveWeb3React from '@/hooks/useActiveWeb3React'
import { toFormatAccount } from '@/utils/format'
import { WEBSITE_CONFIG } from '@/types/constant'

export default function Header() {
  const pathname = usePathname()
  const { openConnectModal, account, loginOut } = useActiveWeb3React()
  return (
    <HeaderContainer>
      <Nav>
        <Logo>{WEBSITE_CONFIG.appTitle}</Logo>
        <NavLinks>
          <NavLink href="/" $active={pathname === '/'}>
            首页
          </NavLink>
          <NavLink href="/contract" $active={pathname === '/contract'}>
            Evm合约调用工具
          </NavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  )
}

