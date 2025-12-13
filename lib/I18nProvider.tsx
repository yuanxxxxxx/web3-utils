'use client'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { useAppSelector } from '@/store/hooks'
import i18n from './i18n'

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const language = useAppSelector((state) => state.app.language)

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
}

