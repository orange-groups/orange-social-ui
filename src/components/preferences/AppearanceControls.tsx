import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import './preferences.css'

export function AppearanceControls() {
  const { t, i18n } = useTranslation('common')
  const { theme, toggleTheme } = useTheme()
  const language = i18n.resolvedLanguage === 'en' ? 'en' : 'vi'
  const nextLanguage = language === 'vi' ? 'en' : 'vi'
  const languageLabel = language === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese'
  return (
    <div className="appearance-controls" role="group" aria-label={t('preferences')}>
      <button type="button" onClick={() => { void i18n.changeLanguage(nextLanguage) }} aria-label={languageLabel} title={languageLabel}>
        {language.toUpperCase()}
      </button>
      <button type="button" onClick={toggleTheme} aria-label={t(theme === 'light' ? 'dark' : 'light')} title={t(theme === 'light' ? 'dark' : 'light')}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          {theme === 'light' ? <path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>}
        </svg>
      </button>
    </div>
  )
}
