import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '../session.store'
import '../auth.css'

function SessionChecking() {
  const { t } = useTranslation('common')
  return <div className="auth-session-checking" role="status">{t('checkingSession')}</div>
}

/** App pages: guests go to /login, then come back to the page they wanted. */
export function ProtectedRoute() {
  const { status } = useSession()
  const location = useLocation()
  if (status === 'checking') return <SessionChecking />
  if (status === 'guest') return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return <Outlet />
}

/** /login: a signed-in user goes straight to the feed. */
export function GuestRoute() {
  const { status } = useSession()
  if (status === 'checking') return <SessionChecking />
  if (status === 'authenticated') return <Navigate to="/home" replace />
  return <Outlet />
}
