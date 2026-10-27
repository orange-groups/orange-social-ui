let inMemoryAccessToken: string | null = null

export function getAccessToken(): string | null {
  return inMemoryAccessToken
}

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token
}

export function clearAccessToken(): void {
  inMemoryAccessToken = null
}

export class ApiError extends Error {
  readonly status: number
  readonly data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:3000'

type RefreshHandler = () => Promise<string | null>

let refreshHandler: RefreshHandler | null = null

/** The auth feature registers how to get a new access token (POST /auth/refresh). */
export function setRefreshHandler(handler: RefreshHandler | null): void {
  refreshHandler = handler
}

// A 401 from these means wrong credentials or a dead session, not an expired access token
const SESSION_PATHS = ['/auth/login', '/auth/refresh', '/auth/logout', '/auth/regis']

async function send(path: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (inMemoryAccessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${inMemoryAccessToken}`)
  }

  const url = path.startsWith('http') ? path : `${API_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`

  return fetch(url, {
    ...init,
    headers,
    credentials: 'include',
  })
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response = await send(path, init)

  // Access token expired (15 min): get a new one from the refresh cookie once, then retry
  if (response.status === 401 && refreshHandler && !SESSION_PATHS.includes(path)) {
    const newAccessToken = await refreshHandler()
    if (newAccessToken) response = await send(path, init)
  }

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload: unknown = isJson ? await response.json() : undefined

  if (!response.ok) {
    const errorMessage =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof (payload as { message: unknown }).message === 'string'
        ? (payload as { message: string }).message
        : `HTTP error ${response.status}`
    throw new ApiError(errorMessage, response.status, payload)
  }

  return payload as T
}
