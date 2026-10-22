import type auth from '../../i18n/locales/vi/auth.json'

export type AuthErrorKey = `errors.${keyof typeof auth.errors}`
