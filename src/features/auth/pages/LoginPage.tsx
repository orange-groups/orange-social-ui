import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { AuthIcon } from '../components/AuthIcon'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  const { t } = useTranslation('auth')
  const { state } = useLocation()
  return (
    <AuthLayout title={t('login.title')} description={t('login.description')}>
      {state?.passwordChanged === true && <p role="status">{t('changePassword.success')}</p>}
      <LoginForm />
      <div className="auth-register"><span>{t('login.noAccount')}</span><Link className="auth-text-button" to="/register">{t('login.register')}<AuthIcon name="arrow" /></Link></div>
    </AuthLayout>
  )
}
