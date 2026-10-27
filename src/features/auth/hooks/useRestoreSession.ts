import { useEffect } from 'react'
import { setRefreshHandler } from '../../../lib/api-client'
import { refreshSession } from '../api/auth.api'
import { getSession } from '../session.store'

/**
 * On every page load (including F5) the in-memory access token is gone, so ask the
 * backend for a new one with the httpOnly refresh cookie. Also lets api-client
 * refresh silently when a request gets 401 because the access token expired.
 */
export function useRestoreSession() {
  useEffect(() => {
    setRefreshHandler(refreshSession)
    if (getSession().status === 'checking') void refreshSession()
    return () => setRefreshHandler(null)
  }, [])
}
