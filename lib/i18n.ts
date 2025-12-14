import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ZH from './locales/zh.json'
import EN from './locales/en.json'
import { WEBSITE_CONFIG } from '@/types/constant'
import { LANGUAGE_ENUM } from '@/types'

const resources = {
  [LANGUAGE_ENUM.zh]: {
    translation: ZH
  },
  [LANGUAGE_ENUM.en]: {
    translation: EN
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: WEBSITE_CONFIG.defaultLanguage, // 默认语言
    fallbackLng: WEBSITE_CONFIG.defaultLanguage,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n

