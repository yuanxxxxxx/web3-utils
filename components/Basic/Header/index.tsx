'use client'

import {
  HeaderContainer,
  NavInner,
  LogoLink,
  LogoIcon,
  LogoText,
  NavActions,
} from './style'
import ThemeToggle from '@/components/Basic/ThemeToggle'
import { WEBSITE_CONFIG } from '@/types/constant'

export default function Header() {
  return (
    <HeaderContainer>
      <NavInner>
        <LogoLink href="/">
          <LogoIcon>🔧</LogoIcon>
          <LogoText>{WEBSITE_CONFIG.appTitle}</LogoText>
        </LogoLink>

        <NavActions>
          <ThemeToggle />
        </NavActions>
      </NavInner>
    </HeaderContainer>
  )
}
