import { useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ApiError } from '../../../lib/api-client'
import { resetPassword } from '../api/auth.api'
import type { AuthErrorKey } from '../auth.types'
import { isValidNewPassword } from '../password-policy'

export function useResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const hasValidToken = /^[a-f0-9]{64}$/.test(token)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<AuthErrorKey>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting || !hasValidToken) return
    if (!isValidNewPassword(password)) {
      setError('errors.passwordPolicy')
      return
    }
    if (password !== confirm) {
      setError('errors.passwordMismatch')
      return
    }
    setIsSubmitting(true)
    setError(undefined)
    try {
      await resetPassword(token, password)
      setIsSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof ApiError && error.status === 400 ? 'errors.resetTokenInvalid' : 'errors.resetFailed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { password, setPassword, confirm, setConfirm, error: hasValidToken ? error : 'errors.resetTokenInvalid' as const, hasValidToken, isSubmitting, isSuccess, handleSubmit }
}
