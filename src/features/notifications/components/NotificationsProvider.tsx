import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getAccessToken } from '../../../lib/api-client'
import { createNotificationsSocket } from '../../../lib/socket'
import { getUnreadCount } from '../api/notifications.api'
import { NotificationsContext } from '../notifications-context'

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState<number | null>(null)
  const [revision, setRevision] = useState(0)
  const invalidate = useCallback(() => setRevision(current => current + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    void getUnreadCount(controller.signal).then(
      value => { if (!controller.signal.aborted) setUnreadCount(value.unreadCount) },
      () => { /* Keep the last count until the next successful sync. */ },
    )
    return () => controller.abort()
  }, [revision])

  useEffect(() => {
    const socket = createNotificationsSocket()
    const controller = new AbortController()
    let recovering = false

    function recoverConnection() {
      if (recovering || socket.active || socket.connected) return
      recovering = true
      const token = getAccessToken()
      void getUnreadCount(controller.signal).then(
        () => {
          if (!controller.signal.aborted && getAccessToken() && getAccessToken() !== token) socket.connect()
        },
        () => { /* A later focus or reconnect can retry. */ },
      ).finally(() => { recovering = false })
    }

    function onDisconnect(reason: string) {
      if (reason === 'io server disconnect') recoverConnection()
    }

    function onFocus() {
      if (document.visibilityState !== 'visible') return
      invalidate()
      if (!socket.active && !socket.connected && getAccessToken()) socket.connect()
    }

    const fallback = window.setInterval(() => {
      if (!socket.connected) onFocus()
    }, 45_000)
    socket.on('connect', invalidate)
    socket.on('notifications:changed', invalidate)
    socket.on('connect_error', recoverConnection)
    socket.on('disconnect', onDisconnect)
    socket.connect()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)

    return () => {
      controller.abort()
      window.clearInterval(fallback)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
      socket.off('connect', invalidate)
      socket.off('notifications:changed', invalidate)
      socket.off('connect_error', recoverConnection)
      socket.off('disconnect', onDisconnect)
      socket.disconnect()
    }
  }, [invalidate])

  return <NotificationsContext.Provider value={{ unreadCount, revision, invalidate }}>{children}</NotificationsContext.Provider>
}
