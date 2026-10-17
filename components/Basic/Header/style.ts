import styled from 'styled-components'
import Link from 'next/link'

const isLightTheme = (bg1: string) => bg1 === '#FFFFFF'

export const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
  height: 64px;
  background-color: ${(props) => props.theme.bg1};
  border-bottom: 1px solid
    ${(props) =>
      isLightTheme(props.theme.bg1)
        ? 'rgba(16, 24, 40, 0.08)'
        : 'rgba(255, 255, 255, 0.1)'};
  box-shadow: ${(props) =>
    isLightTheme(props.theme.bg1)
      ? '0 1px 2px rgba(16, 24, 40, 0.06)'
      : '0 1px 2px rgba(0, 0, 0, 0.4)'};
  backdrop-filter: blur(8px);
`

export const NavInner = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;

  @media screen and (max-width: 520px) {
    gap: 8px;
    padding: 0 12px;
  }
`

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
  margin-right: auto;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.88;
  }
`

export const LogoIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eff 0%, #0066ea 100%);
  font-size: 16px;
  line-height: 1;
  box-shadow: 0 2px 8px rgba(102, 126, 255, 0.35);
`

export const LogoText = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: ${(props) =>
    isLightTheme(props.theme.bg1) ? '#101828' : '#f9fafb'};
  letter-spacing: -0.02em;
  white-space: nowrap;

  @media screen and (max-width: 520px) {
    display: none;
  }
`

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 10px;
  background: ${(props) =>
    isLightTheme(props.theme.bg1)
      ? 'rgba(102, 126, 255, 0.06)'
      : 'rgba(255, 255, 255, 0.06)'};
`

export const NavLink = styled(Link)<{ $active?: boolean }>`
  text-decoration: none;
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? '600' : '500')};
  color: ${(props) =>
    props.$active
      ? '#fff'
      : isLightTheme(props.theme.bg1)
        ? '#667085'
        : '#98a2b3'};
  padding: 7px 14px;
  border-radius: 8px;
  white-space: nowrap;
  transition: color 0.2s, background 0.2s, box-shadow 0.2s;
  background: ${(props) =>
    props.$active ? props.theme.primary : 'transparent'};
  box-shadow: ${(props) =>
    props.$active ? '0 1px 3px rgba(0, 102, 234, 0.25)' : 'none'};

  &:hover {
    color: ${(props) => (props.$active ? '#fff' : props.theme.primary)};
    background: ${(props) =>
      props.$active
        ? props.theme.primary
        : 'rgba(102, 126, 255, 0.1)'};
  }

  .short {
    display: none;
  }

  @media screen and (max-width: 640px) {
    padding: 7px 12px;
    font-size: 13px;

    .full {
      display: none;
    }

    .short {
      display: inline;
    }
  }
`

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

export const WalletButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`
