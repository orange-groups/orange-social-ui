import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../../lib/api-client'
import { changePassword } from '../api/auth.api'
import { isValidNewPassword } from '../password-policy'

export function useChangePassword() {
  const navigate = useNavigate()
  const [error, setError] = useState<'passwordRule' | 'mismatch' | 'same' | 'incorrect' | 'error'>()
  const [isSaving, setIsSaving] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSaving) return
    const data = new FormData(event.currentTarget)
    const currentPassword = String(data.get('currentPassword') ?? '')
    const newPassword = String(data.get('newPassword') ?? '')
    if (!isValidNewPassword(newPassword)) {
      setError('passwordRule')
      return
    }
    if (newPassword !== data.get('confirmPassword')) {
      setError('mismatch')
      return
    }
    if (newPassword === currentPassword) {
      setError('same')
      return
    }

    setError(undefined)
    setIsSaving(true)
    try {
      await changePassword(currentPassword, newPassword)
      navigate('/login', { replace: true, state: { passwordChanged: true, from: '/profile' } })
    } catch (cause) {
      setError(cause instanceof ApiError && cause.status === 403 ? 'incorrect' : 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return { error, isSaving, submit }
}
