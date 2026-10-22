import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'

export function CheckEmailPage() {
  const { t } = useTranslation('social')
  return <AuthLayout title={t('auth.checkTitle')} description={t('auth.checkDescription')}><Link className="auth-submit" to="/reset-password?demo=1">{t('auth.openReset')}</Link></AuthLayout>
}
