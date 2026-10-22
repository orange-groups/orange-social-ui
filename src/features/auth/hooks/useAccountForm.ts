import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import type { AuthErrorKey } from '../auth.types'

type AccountMode = 'register' | 'recovery'
type Field = 'name' | 'email' | 'password' | 'confirmPassword'
type Values = Record<Field, string>

export function useAccountForm(mode: AccountMode) {
  const navigate = useNavigate()
  const [values, setValues] = useState<Values>({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, AuthErrorKey>>>({})
  function changeField(field: Field, value: string) {
    setValues(previous => ({ ...previous, [field]: value }))
    setErrors(previous => ({ ...previous, [field]: undefined }))
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
    const firstInvalid = (['name', 'email', 'password', 'confirmPassword'] as const).find(field => next[field])
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    navigate(mode === 'register' ? '/verify-email' : '/check-email')
  }
  return { values, errors, changeField, handleSubmit }
}
