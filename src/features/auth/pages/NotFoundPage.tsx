import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'

export function NotFoundPage() {
  const { t } = useTranslation('common')
  return (
    <AuthLayout title={t('notFoundTitle')} description={t('notFoundDescription')}>
      <nav className="auth-preview-links"><Link className="auth-submit" to="/">{t('backHome')}</Link><Link className="auth-text-button" to="/login">{t('tryLogin')}</Link></nav>
    </AuthLayout>
  )
}
