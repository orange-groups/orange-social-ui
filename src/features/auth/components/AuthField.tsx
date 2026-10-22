import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { AuthIcon } from './AuthIcon'

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string }

export function AuthField({ id, label, error, type = 'text', ...props }: AuthFieldProps) {
  const { t } = useTranslation('auth')
  const [isVisible, setIsVisible] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <input {...props} id={id} type={isPassword && isVisible ? 'text' : type} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
        {isPassword && <button className="auth-password-toggle" type="button" aria-label={t(isVisible ? 'fields.hidePassword' : 'fields.showPassword')} aria-pressed={isVisible} aria-controls={id} onClick={() => setIsVisible(!isVisible)}><AuthIcon name={isVisible ? 'eye-off' : 'eye'} /></button>}
      </div>
      {error && <p id={`${id}-error`} className="auth-field-error">{error}</p>}
    </div>
  )
}
