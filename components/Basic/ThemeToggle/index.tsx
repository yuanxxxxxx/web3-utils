'use client'

import React from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleDarkMode } from '@/store/appSlice'
import { ToggleButton, IconWrapper } from './style'

export default function ThemeToggle() {
  const dispatch = useAppDispatch()
  const isDarkMode = useAppSelector((state) => state.app.isDarkMode)

  const handleToggle = () => {
    dispatch(toggleDarkMode())
  }

  return (
    <ToggleButton onClick={handleToggle} $isDark={isDarkMode}>
      <IconWrapper $isDark={isDarkMode}>
        {isDarkMode ? '🌙' : '☀️'}
      </IconWrapper>
    </ToggleButton>
  )
}
