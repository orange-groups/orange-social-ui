export const LANGUAGE_KEY = 'orange-language'
export const THEME_KEY = 'orange-theme'

export function readPreference(key: string): string | null {
  try { return window.localStorage.getItem(key) } catch { return null }
}

export function writePreference(key: string, value: string) {
  try { window.localStorage.setItem(key, value) } catch { /* Preferences still work in memory. */ }
}
