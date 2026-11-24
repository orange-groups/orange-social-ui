import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../api/auth.api'

export function useLogout() {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logoutUser()
    } catch {
      // Local session is already cleared by logoutUser; the cookie expires within a day
    }
    navigate('/login', { replace: true })
  }

  return { isLoggingOut, handleLogout }
}
