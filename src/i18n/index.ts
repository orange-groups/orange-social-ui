import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LANGUAGE_KEY, readPreference, writePreference } from '../app/preferences'
import viCommon from './locales/vi/common.json'
import viAuth from './locales/vi/auth.json'
import viLanding from './locales/vi/landing.json'
import enCommon from './locales/en/common.json'
import enAuth from './locales/en/auth.json'
import enLanding from './locales/en/landing.json'

import viHome from './locales/vi/home.json'
import enHome from './locales/en/home.json'
import viSocial from './locales/vi/social.json'
import enSocial from './locales/en/social.json'

const storedLanguage = readPreference(LANGUAGE_KEY)
const language = storedLanguage === 'en' || storedLanguage === 'vi' ? storedLanguage : 'vi'

await i18n.use(initReactI18next).init({
  resources: {
    vi: { common: viCommon, auth: viAuth, landing: viLanding, home: viHome, social: viSocial },
    en: { common: enCommon, auth: enAuth, landing: enLanding, home: enHome, social: enSocial },
  },
  lng: language,
  fallbackLng: 'vi',
  supportedLngs: ['vi', 'en'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

document.documentElement.lang = language
i18n.on('languageChanged', nextLanguage => {
  document.documentElement.lang = nextLanguage
  writePreference(LANGUAGE_KEY, nextLanguage)
})

export default i18n
