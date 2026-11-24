import { useEffect, useRef, useState } from 'react'
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../api/notifications.api'
import type { NotificationItem } from '../api/notifications.api'
import { useNotifications } from '../notifications-context'

export function useNotificationsInbox() {
  const { unreadCount, revision, invalidate } = useNotifications()
  const [items, setItems] = useState<NotificationItem[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [loadedRevision, setLoadedRevision] = useState<number | null>(null)
  const [listError, setListError] = useState(false)
  const [actionError, setActionError] = useState(false)
  const [moreStatus, setMoreStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [isUpdating, setIsUpdating] = useState(false)
  const updateLock = useRef(false)
  const moreRequest = useRef<AbortController | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    void getNotifications(controller.signal).then(
      page => {
        if (controller.signal.aborted) return
        setItems(page.items)
        setCursor(page.nextCursor)
        setListError(false)
        setMoreStatus('idle')
        setLoadedRevision(revision)
      },
      () => { if (!controller.signal.aborted) setListError(true) },
    )
    return () => {
      controller.abort()
      moreRequest.current?.abort()
    }
  }, [revision])

  async function loadMore() {
    if (loadedRevision !== revision || !cursor || moreRequest.current) return
    const controller = new AbortController()
    moreRequest.current = controller
    setMoreStatus('loading')
    try {
      const page = await getNotifications(controller.signal, cursor)
      if (controller.signal.aborted) return
      setItems(current => {
        const ids = new Set(current.map(item => item.id))
        return [...current, ...page.items.filter(item => !ids.has(item.id))]
      })
      setCursor(page.nextCursor)
      setMoreStatus('idle')
    } catch {
      if (!controller.signal.aborted) setMoreStatus('error')
    } finally {
      moreRequest.current = null
    }
  }

  async function markRead(id?: string) {
    if (updateLock.current) return
    updateLock.current = true
    setIsUpdating(true)
    setActionError(false)
    try {
      if (id) await markNotificationRead(id)
      else await markAllNotificationsRead()
      invalidate()
    } catch {
      setActionError(true)
    } finally {
      updateLock.current = false
      setIsUpdating(false)
    }
  }

  function retry() {
    setListError(false)
    invalidate()
  }

  return {
    items, unreadCount, listError, actionError, isUpdating, retry, markRead, loadMore,
    isLoading: loadedRevision === null && !listError,
    canLoadMore: !!cursor && loadedRevision === revision,
    moreStatus,
  }
}
