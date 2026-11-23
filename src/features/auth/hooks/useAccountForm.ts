import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { ApiError } from '../../../lib/api-client'
import { registerUser, requestPasswordReset } from '../api/auth.api'
import type { AuthErrorKey } from '../auth.types'
import { isValidNewPassword } from '../password-policy'

type AccountMode = 'register' | 'recovery'
type Field = 'name' | 'email' | 'password' | 'confirmPassword'
type Values = Record<Field, string>

export function useAccountForm(mode: AccountMode) {
  const navigate = useNavigate()
  const [values, setValues] = useState<Values>({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, AuthErrorKey>>>({})
  const [serverError, setServerError] = useState<AuthErrorKey>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  function changeField(field: Field, value: string) {
    setValues(previous => ({ ...previous, [field]: value }))
    setErrors(previous => ({ ...previous, [field]: undefined }))
    setServerError(undefined)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const formElement = event.currentTarget
    const next: Partial<Record<Field, AuthErrorKey>> = {}
    if (mode === 'register' && !values.name.trim()) next.name = 'errors.nameRequired'
    if (!values.email.trim()) next.email = 'errors.emailRequired'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'errors.emailInvalid'
    if (mode === 'register') {
      if (!values.password) next.password = 'errors.passwordRequired'
      else if (!isValidNewPassword(values.password)) next.password = 'errors.passwordPolicy'
      if (!values.confirmPassword || values.confirmPassword !== values.password) next.confirmPassword = 'errors.passwordMismatch'
    }
    setErrors(next)
    setServerError(undefined)
    const firstInvalid = (['name', 'email', 'password', 'confirmPassword'] as const).find(field => next[field])
    if (firstInvalid) {
      formElement.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === 'recovery') {
        await requestPasswordReset(values.email.trim())
        navigate('/check-email')
        return
      }
      await registerUser({
        fullName: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      navigate('/home')
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 409) {
        setErrors(previous => ({ ...previous, email: 'errors.emailExists' }))
        formElement.querySelector<HTMLInputElement>('[name="email"]')?.focus()
      } else {
        setServerError(mode === 'recovery' ? 'errors.recoveryFailed' : 'errors.registerFailed')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return { values, errors, serverError, isSubmitting, changeField, handleSubmit }
}
