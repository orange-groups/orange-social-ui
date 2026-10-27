import { useSyncExternalStore } from 'react'
import { clearAccessToken, setAccessToken } from '../../lib/api-client'
import type { AuthUser } from './auth.types'

/**
 * - `checking`: page just loaded (or F5), asking the backend if the refresh cookie is still valid
 * - `authenticated` / `guest`: the answer
 */
export type SessionStatus = 'checking' | 'authenticated' | 'guest'

type SessionState = { status: SessionStatus; user: AuthUser | null }

let state: SessionState = { status: 'checking', user: null }
const listeners = new Set<() => void>()

function update(next: SessionState) {
  state = next
  listeners.forEach(listener => listener())
}

/** Access token stays in memory (api-client); only the user and status live here. */
export function setSession(session: { accessToken: string; user: AuthUser }): void {
  setAccessToken(session.accessToken)
  update({ status: 'authenticated', user: session.user })
}

export function clearSession(): void {
  clearAccessToken()
  update({ status: 'guest', user: null })
}

export function getSession(): SessionState {
  return state
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function useSession(): SessionState {
  return useSyncExternalStore(subscribe, getSession)
}
