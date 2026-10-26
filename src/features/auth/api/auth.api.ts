import { apiRequest, setAccessToken } from '../../../lib/api-client'
import type { AuthUser, RegisterRequest, RegisterResponse } from '../auth.types'

let currentAuthenticatedUser: AuthUser | null = null

export function getAuthenticatedUser(): AuthUser | null {
  return currentAuthenticatedUser
}

export async function registerUser(payload: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiRequest<RegisterResponse>('/auth/regis', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  setAccessToken(response.accessToken)
  currentAuthenticatedUser = response.user
  return response
}
