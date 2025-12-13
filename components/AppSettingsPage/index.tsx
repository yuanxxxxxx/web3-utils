'use client'

import { useTranslation } from 'react-i18next'
import {
  SettingsContainer,
  SettingsTitle,
  SettingItem,
  Select,
} from './style'
import ThemeToggle from '../Basic/ThemeToggle'
import LanguageToggle from '../Basic/LangusgeToggle'

export default function AppSettings() {
  const { t } = useTranslation()

  return (
    <SettingsContainer>
      <SettingsTitle>⚙️ {t('Setting')}</SettingsTitle>
      <SettingItem>
        <ThemeToggle />
        <LanguageToggle />
      </SettingItem>
    </SettingsContainer>
  )
}

