'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './theme/theme'
import { useAppSelector } from '@/store/hooks'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())
  const isDarkMode = useAppSelector((state) => state.app.isDarkMode)
  
  const theme = isDarkMode ? darkTheme : lightTheme

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') {
    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    )
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </StyleSheetManager>
  )
}

