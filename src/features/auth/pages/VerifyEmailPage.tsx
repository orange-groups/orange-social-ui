import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { AuthField } from '../components/AuthField'

export function VerifyEmailPage() {
  const { t } = useTranslation('social')
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  return <AuthLayout title={t('auth.verifyTitle')} description={t('auth.verifyDescription')}><form className="auth-form" onSubmit={event => { event.preventDefault(); if (!/^\d{6}$/.test(code)) { setError(true); return } navigate('/preview', { state: { flow: 'register' } }) }}><AuthField id="verify-code" label={t('auth.code')} inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={event => { setCode(event.target.value.replace(/\D/g, '')); setError(false) }} error={error ? t('auth.invalidCode') : undefined} /><button className="auth-submit auth-account-submit">{t('auth.verify')}</button></form></AuthLayout>
}
