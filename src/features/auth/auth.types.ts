import type auth from '../../i18n/locales/vi/auth.json'

export type AuthErrorKey = `errors.${keyof typeof auth.errors}`

export interface AuthUser {
  id: string
  email: string
  username: string
  fullName: string
  avatarUrl: string | null
  isEmailVerified: boolean
  createdAt: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

export interface RegisterResponse {
  accessToken: string
  user: AuthUser
}

export interface LoginRequest {
  email: string
  password: string
}

/** Same shape as RegisterResponse; also returned by POST /auth/refresh. */
export type LoginResponse = RegisterResponse
