'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTheme } from '@/store/appSlice'
import { ToggleButton, IconWrapper } from './style'
import { IAppState, THEME_ENUM } from '@/types'

export default function ThemeToggle() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(({app}: {app: IAppState}) => app.theme)

  const isDarkMode = theme === THEME_ENUM.dark
  const handleToggle = () => {
    dispatch(setTheme(theme === THEME_ENUM.dark ? THEME_ENUM.light : THEME_ENUM.dark))
  }

  return (
    <ToggleButton onClick={handleToggle} >
      <IconWrapper $isDark={isDarkMode}>
        {isDarkMode ? '🌙' : '☀️'}
      </IconWrapper>
    </ToggleButton>
  )
}
