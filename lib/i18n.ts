import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ZH from './locales/zh.json'
import EN from './locales/en.json'

const resources = {
  'zh': {
    translation: ZH
  },
  'en': {
    translation: EN
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // 默认语言
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n

