import { apiRequest } from '../../../lib/api-client'
import type { AuthUser, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../auth.types'
import { clearSession, getSession, setSession } from '../session.store'

export function getAuthenticatedUser(): AuthUser | null {
  return getSession().user
}

export async function registerUser(payload: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiRequest<RegisterResponse>('/auth/regis', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  setSession(response)
  return response
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  setSession(response)
  return response
}

let refreshInFlight: Promise<string | null> | null = null

/**
 * Gets a new access token from the httpOnly refresh cookie (after F5, or when the
 * 15-minute access token expires). Parallel callers share one request because the
 * backend rotates the refresh token: a second call with the old cookie would fail.
 */
export function refreshSession(): Promise<string | null> {
  refreshInFlight ??= apiRequest<LoginResponse>('/auth/refresh', { method: 'POST' })
    .then(response => {
      setSession(response)
      return response.accessToken
    })
    .catch(() => {
      clearSession()
      return null
    })
    .finally(() => { refreshInFlight = null })
  return refreshInFlight
}

export async function logoutUser(): Promise<void> {
  try {
    await apiRequest<{ message: string }>('/auth/logout', { method: 'POST' })
  } finally {
    clearSession()
  }
}
