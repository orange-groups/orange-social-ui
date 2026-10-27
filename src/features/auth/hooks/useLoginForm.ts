import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ApiError } from '../../../lib/api-client'
import { loginUser } from '../api/auth.api'
import type { AuthErrorKey } from '../auth.types'

type LoginErrors = { email?: AuthErrorKey; password?: AuthErrorKey }

function toServerError(error: unknown): AuthErrorKey {
  if (!(error instanceof ApiError)) return 'errors.network'
  if (error.status === 401) return 'errors.invalidCredentials'
  return 'errors.loginFailed'
}

export function useLoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [serverError, setServerError] = useState<AuthErrorKey>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return
    const formElement = event.currentTarget
    const nextErrors: LoginErrors = {}
    const normalizedEmail = email.trim()
    if (!normalizedEmail) nextErrors.email = 'errors.emailRequired'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) nextErrors.email = 'errors.emailInvalid'
    if (!password) nextErrors.password = 'errors.passwordRequired'
    setErrors(nextErrors)
    setServerError(undefined)
    if (nextErrors.email || nextErrors.password) {
      formElement.querySelector<HTMLInputElement>(nextErrors.email ? '#login-email' : '#login-password')?.focus()
      return
    }

    setIsSubmitting(true)
    try {
      await loginUser({ email: normalizedEmail, password })
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/home', { replace: true })
    } catch (error: unknown) {
      setServerError(toServerError(error))
      setIsSubmitting(false)
    }
  }

  return { email, password, errors, serverError, isSubmitting, handleSubmit,
    changeEmail(value: string) { setEmail(value); setServerError(undefined); setErrors(previous => ({ ...previous, email: undefined })) },
    changePassword(value: string) { setPassword(value); setServerError(undefined); setErrors(previous => ({ ...previous, password: undefined })) },
  }
}
