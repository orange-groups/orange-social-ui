import { useTranslation } from 'react-i18next'
import { useAccountForm } from '../hooks/useAccountForm'
import { AuthField } from './AuthField'
import { AuthIcon } from './AuthIcon'

type AccountFormProps = { mode: 'register' | 'recovery' }

export function AccountForm({ mode }: AccountFormProps) {
  const { t } = useTranslation('auth')
  const { values, errors, serverError, isSubmitting, changeField, handleSubmit } = useAccountForm(mode)
  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit}>
      {mode === 'register' && <AuthField id="register-name" name="name" label={t('fields.name')} placeholder={t('fields.namePlaceholder')} autoComplete="name" required value={values.name} onChange={event => changeField('name', event.target.value)} error={errors.name ? t(errors.name) : undefined} />}
      <AuthField id={`${mode}-email`} name="email" type="email" label={t('fields.email')} placeholder={t('fields.emailPlaceholder')} autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} required value={values.email} onChange={event => changeField('email', event.target.value)} error={errors.email ? t(errors.email) : undefined} />
      {mode === 'register' && <>
        <AuthField id="register-password" name="password" type="password" label={t('fields.password')} placeholder={t('fields.newPasswordPlaceholder')} autoComplete="new-password" required minLength={8} value={values.password} onChange={event => changeField('password', event.target.value)} error={errors.password ? t(errors.password) : undefined} />
        <AuthField id="register-confirm-password" name="confirmPassword" type="password" label={t('fields.confirmPassword')} placeholder={t('fields.confirmPasswordPlaceholder')} autoComplete="new-password" required value={values.confirmPassword} onChange={event => changeField('confirmPassword', event.target.value)} error={errors.confirmPassword ? t(errors.confirmPassword) : undefined} />
      </>}
      {serverError && <p className="auth-field-error" role="alert">{t(serverError)}</p>}
      <button className="auth-submit auth-account-submit" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>{t(`${mode}.submit`)}<AuthIcon name="arrow" /></button>
    </form>
  )
}
