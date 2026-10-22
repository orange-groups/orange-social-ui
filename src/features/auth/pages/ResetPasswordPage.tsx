import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { AuthField } from '../components/AuthField'

export function ResetPasswordPage() {
  const { t } = useTranslation('social')
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  return <AuthLayout title={t('auth.resetTitle')} description={t('auth.resetDescription')}><form className="auth-form" onSubmit={event => { event.preventDefault(); if (!(password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password))) { setError(t('auth.passwordRule')); return } if (password !== confirm) { setError(t('auth.mismatch')); return } navigate('/preview', { state: { flow: 'recovery' } }) }}><AuthField id="reset-password" label={t('auth.newPassword')} type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} /><p className="auth-password-hint">{t('auth.passwordRule')}</p><AuthField id="confirm-reset-password" label={t('auth.confirmPassword')} type="password" autoComplete="new-password" value={confirm} onChange={event => setConfirm(event.target.value)} />{error && <p className="auth-field-error" role="alert">{error}</p>}<button className="auth-submit auth-account-submit">{t('auth.reset')}</button></form></AuthLayout>
}
