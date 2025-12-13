'use client'

import { usePathname } from 'next/navigation'
import { HeaderContainer, Nav, Logo, NavLinks, NavLink } from './style'

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
      </Nav>
    </HeaderContainer>
  )
}

