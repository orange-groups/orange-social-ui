import { ApiError, apiRequest } from '../../../lib/api-client'
import type { AuthUser, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../auth.types'
import { clearSession, getSession, markSessionUnavailable, setSession } from '../session.store'

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

export function requestPasswordReset(email: string): Promise<{ message: string }> {
  return apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) })
  clearSession()
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiRequest<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  clearSession()
}

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
    .catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        clearSession()
        return null
      }
      markSessionUnavailable()
      throw error
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
