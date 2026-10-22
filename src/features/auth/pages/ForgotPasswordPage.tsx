import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { AccountForm } from '../components/AccountForm'

export function ForgotPasswordPage() {
  const { t } = useTranslation('auth')
  return (
    <AuthLayout title={t('recovery.title')} description={t('recovery.description')} eyebrow={t('recovery.eyebrow')}>
      <AccountForm mode="recovery" />
      <div className="auth-register"><Link className="auth-text-button" to="/login">{t('recovery.back')}</Link></div>
    </AuthLayout>
  )
}
