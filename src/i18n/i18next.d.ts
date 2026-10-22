import 'i18next'
import type common from './locales/vi/common.json'
import type auth from './locales/vi/auth.json'
import type landing from './locales/vi/landing.json'

import type home from './locales/vi/home.json'
import type social from './locales/vi/social.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: { common: typeof common; auth: typeof auth; landing: typeof landing; home: typeof home; social: typeof social }
  }
}
