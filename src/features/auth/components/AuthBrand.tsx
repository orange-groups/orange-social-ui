import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function AuthBrand() {
  const { t } = useTranslation('common')
  return (
    <Link className="auth-brand" to="/" aria-label={t('brandHome')}>
      <svg width="36" height="40" viewBox="0 0 36 40" fill="none" aria-hidden="true">
        <path d="M18 9C18 3 23 1 29 3c-1 6-5 8-11 6Z" fill="currentColor" />
        <circle cx="17" cy="24" r="14" stroke="currentColor" strokeWidth="4" />
        <path d="M9 22c0-3 2-5 5-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span>{t('wordmark')}<span className="auth-brand-dot">.</span></span>
    </Link>
  )
}
