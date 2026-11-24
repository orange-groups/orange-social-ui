import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'

export function CheckEmailPage() {
  const { t } = useTranslation('social')
  const { t: auth } = useTranslation('auth')
  return <AuthLayout title={t('auth.checkTitle')} description={t('auth.checkDescription')}><Link className="auth-text-button" to="/login">{auth('recovery.back')}</Link></AuthLayout>
}
