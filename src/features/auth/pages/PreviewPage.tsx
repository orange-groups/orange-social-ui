import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'

export function PreviewPage() {
  const { t } = useTranslation('common')
  const { t: home } = useTranslation('home')
  const location = useLocation()
  const state: unknown = location.state
  const flow = state && typeof state === 'object' && 'flow' in state ? state.flow : undefined
  const message = flow === 'login' ? 'previewLogin' : flow === 'register' ? 'previewRegister' : flow === 'recovery' ? 'previewRecovery' : undefined
  return (
    <AuthLayout title={t('previewTitle')} description={t('previewDescription')} eyebrow={t('previewLabel')}>
      {message && <div className="auth-feedback" role="status"><p>{t(message)}</p></div>}
      <nav className="auth-preview-links" aria-label={t('previewLabel')}>
        <Link className="auth-submit" to="/home">{home('openHome')}</Link>
        <Link className="auth-text-button" to="/login">{t('tryLogin')}</Link>
        <Link className="auth-text-button" to="/register">{t('tryRegister')}</Link>
        <Link className="auth-text-button" to="/forgot-password">{t('tryRecovery')}</Link>
      </nav>
    </AuthLayout>
  )
}
