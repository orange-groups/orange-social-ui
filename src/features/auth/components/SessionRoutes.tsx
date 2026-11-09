import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '../session.store'
import { useState } from 'react'
import { refreshSession } from '../api/auth.api'
import '../auth.css'

function SessionChecking() {
  const { t } = useTranslation('common')
  return <div className="auth-session-checking" role="status">{t('checkingSession')}</div>
}

function SessionUnavailable() {
  const { t } = useTranslation('common')
  const [isRetrying, setIsRetrying] = useState(false)
  async function retry() {
    setIsRetrying(true)
    try { await refreshSession() } catch {
      // Keep the retry view; a transient outage must not discard the session.
    } finally { setIsRetrying(false) }
  }
  return <div className="auth-session-checking"><div><p role="alert">{t('sessionUnavailable')}</p><button type="button" disabled={isRetrying} aria-busy={isRetrying} onClick={() => void retry()}>{t('retrySession')}</button></div></div>
}

/** App pages: guests go to /login, then come back to the page they wanted. */
export function ProtectedRoute() {
  const { status } = useSession()
  const location = useLocation()
  if (status === 'checking') return <SessionChecking />
  if (status === 'unavailable') return <SessionUnavailable />
  if (status === 'guest') return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return <Outlet />
}

/** /login: a signed-in user goes straight to the feed. */
export function GuestRoute() {
  const { status } = useSession()
  if (status === 'checking') return <SessionChecking />
  if (status === 'unavailable') return <SessionUnavailable />
  if (status === 'authenticated') return <Navigate to="/home" replace />
  return <Outlet />
}
