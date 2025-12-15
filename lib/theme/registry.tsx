'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './theme'
import { useAppSelector } from '@/store/hooks'
import { IAppState } from '@/types'
import { THEME_ENUM } from '@/types'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())
  const {theme} = useAppSelector(({app}: {app: IAppState}) => app)
  
  const themeObject = theme === THEME_ENUM.dark ? darkTheme : lightTheme

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') {
    return (
      <ThemeProvider theme={themeObject}>
        {children}
      </ThemeProvider>
    )
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <ThemeProvider theme={themeObject}>
        {children}
      </ThemeProvider>
    </StyleSheetManager>
  )
}

