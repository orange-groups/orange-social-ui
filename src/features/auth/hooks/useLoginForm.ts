import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import type { AuthErrorKey } from '../auth.types'

type LoginErrors = { email?: AuthErrorKey; password?: AuthErrorKey }

export function useLoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: LoginErrors = {}
    const normalizedEmail = email.trim()
    if (!normalizedEmail) nextErrors.email = 'errors.emailRequired'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) nextErrors.email = 'errors.emailInvalid'
    if (!password) nextErrors.password = 'errors.passwordRequired'
    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) {
      event.currentTarget.querySelector<HTMLInputElement>(nextErrors.email ? '#login-email' : '#login-password')?.focus()
      return
    }
    navigate('/preview', { state: { flow: 'login' } })
  }

  return { email, password, errors, handleSubmit,
    changeEmail(value: string) { setEmail(value); setErrors(previous => ({ ...previous, email: undefined })) },
    changePassword(value: string) { setPassword(value); setErrors(previous => ({ ...previous, password: undefined })) },
  }
}
