import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { AccountForm } from '../components/AccountForm'

export function RegisterPage() {
  const { t } = useTranslation('auth')
  return (
    <AuthLayout title={t('register.title')} description={t('register.description')} eyebrow={t('register.eyebrow')}>
      <AccountForm mode="register" />
      <div className="auth-register"><span>{t('register.hasAccount')}</span><Link className="auth-text-button" to="/login">{t('register.login')}</Link></div>
    </AuthLayout>
  )
}
