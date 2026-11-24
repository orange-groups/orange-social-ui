import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthLayout } from '../components/AuthLayout'
import { AuthField } from '../components/AuthField'
import { useResetPassword } from '../hooks/useResetPassword'

export function ResetPasswordPage() {
  const { t } = useTranslation('social')
  const { t: auth } = useTranslation('auth')
  const form = useResetPassword()
  return (
    <AuthLayout title={t('auth.resetTitle')} description={t('auth.resetDescription')}>
      {form.isSuccess ? <div role="status"><p>{auth('recovery.resetSuccess')}</p><Link className="auth-submit" to="/login">{auth('recovery.back')}</Link></div> :
        <form className="auth-form" onSubmit={form.handleSubmit}>
          <AuthField id="reset-password" label={t('auth.newPassword')} type="password" autoComplete="new-password" aria-describedby="reset-password-hint" required value={form.password} onChange={event => form.setPassword(event.target.value)} />
          <p id="reset-password-hint" className="auth-password-hint">{auth('errors.passwordPolicy')}</p>
          <AuthField id="confirm-reset-password" label={t('auth.confirmPassword')} type="password" autoComplete="new-password" required value={form.confirm} onChange={event => form.setConfirm(event.target.value)} />
          {form.error && <p className="auth-field-error" role="alert">{auth(form.error)}</p>}
          <button className="auth-submit auth-account-submit" disabled={form.isSubmitting || !form.hasValidToken} aria-busy={form.isSubmitting}>{t('auth.reset')}</button>
          {!form.hasValidToken && <Link className="auth-text-button" to="/forgot-password">{auth('recovery.submit')}</Link>}
        </form>}
    </AuthLayout>
  )
}
