import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useLoginForm } from '../hooks/useLoginForm'
import { AuthField } from './AuthField'
import { AuthIcon } from './AuthIcon'

export function LoginForm() {
  const { t } = useTranslation('auth')
  const form = useLoginForm()
  return (
    <form className="auth-form" noValidate onSubmit={form.handleSubmit}>
      <AuthField id="login-email" label={t('fields.email')} name="email" type="email" autoComplete="username" inputMode="email" autoCapitalize="none" spellCheck={false} placeholder={t('fields.emailPlaceholder')} required value={form.email} onChange={event => form.changeEmail(event.target.value)} error={form.errors.email ? t(form.errors.email) : undefined} />
      <AuthField id="login-password" label={t('fields.password')} name="password" type="password" autoComplete="current-password" placeholder={t('fields.passwordPlaceholder')} required value={form.password} onChange={event => form.changePassword(event.target.value)} error={form.errors.password ? t(form.errors.password) : undefined} />
      <div className="auth-form-options"><Link className="auth-text-button" to="/forgot-password">{t('login.forgot')}</Link></div>
      <button className="auth-submit" type="submit">{t('login.submit')}<AuthIcon name="arrow" /></button>
    </form>
  )
}
