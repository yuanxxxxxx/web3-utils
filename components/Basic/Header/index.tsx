'use client'

import { usePathname } from 'next/navigation'
import {
  HeaderContainer,
  NavInner,
  LogoLink,
  LogoIcon,
  LogoText,
  NavLinks,
  NavLink,
  NavActions,
} from './style'
import ThemeToggle from '@/components/Basic/ThemeToggle'
import { WEBSITE_CONFIG } from '@/types/constant'

export default function Header() {
  const pathname = usePathname()

  return (
    <HeaderContainer>
      <NavInner>
        <LogoLink href="/">
          <LogoIcon>🔧</LogoIcon>
          <LogoText>{WEBSITE_CONFIG.appTitle}</LogoText>
        </LogoLink>

        <NavLinks>
          <NavLink href="/" $active={pathname === '/'}>
            导航工具
          </NavLink>
          <NavLink href="/contract" $active={pathname === '/contract'}>
            <span className="full">Evm合约调用工具</span>
            <span className="short">合约工具</span>
          </NavLink>
        </NavLinks>

        <NavActions>
          <ThemeToggle />
        </NavActions>
      </NavInner>
    </HeaderContainer>
  )
}
