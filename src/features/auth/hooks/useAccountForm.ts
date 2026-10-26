import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { ApiError } from '../../../lib/api-client'
import { registerUser } from '../api/auth.api'
import type { AuthErrorKey } from '../auth.types'

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
      else if (!(values.password.length >= 8 && /[a-z]/.test(values.password) && /[A-Z]/.test(values.password) && /\d/.test(values.password) && /[^A-Za-z0-9]/.test(values.password))) next.password = 'errors.passwordShort'
      if (!values.confirmPassword || values.confirmPassword !== values.password) next.confirmPassword = 'errors.passwordMismatch'
    }
    setErrors(next)
    setServerError(undefined)
    const firstInvalid = (['name', 'email', 'password', 'confirmPassword'] as const).find(field => next[field])
    if (firstInvalid) {
      formElement.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    if (mode === 'recovery') {
      navigate('/check-email')
      return
    }

    setIsSubmitting(true)
    try {
      await registerUser({
        fullName: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      navigate('/verify-email')
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 409) {
        setErrors(previous => ({ ...previous, email: 'errors.emailExists' }))
        formElement.querySelector<HTMLInputElement>('[name="email"]')?.focus()
      } else {
        setServerError('errors.registerFailed')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return { values, errors, serverError, isSubmitting, changeField, handleSubmit }
}
