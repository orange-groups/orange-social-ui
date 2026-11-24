import { useEffect, useRef, useState } from 'react'
import { ApiError } from '../../../lib/api-client'
import { acceptFriendRequest, cancelFriendRequest } from '../api/friend-requests.api'
import { fetchFriendsList } from '../api/friends-list.api'
import type { FriendsListKind } from '../api/friends-list.api'

type ListState = { status: 'loading' | 'error' } | {
  status: 'ready'
  page: Awaited<ReturnType<typeof fetchFriendsList>>
}

export function useFriendsList(kind: FriendsListKind, onAccepted?: () => void) {
  const [state, setState] = useState<ListState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [more, setMore] = useState<'idle' | 'loading' | 'error'>('idle')
  const [submittingId, setSubmittingId] = useState<string>()
  const [hasMutationError, setHasMutationError] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  const isLoadingMore = useRef(false)
  const isSubmitting = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    controllerRef.current = controller
    void fetchFriendsList(kind, controller.signal).then(
      page => { if (!controller.signal.aborted) setState({ status: 'ready', page }) },
      () => { if (!controller.signal.aborted) setState({ status: 'error' }) },
    )
    return () => controller.abort()
  }, [kind, attempt])

  function retry() {
    setState({ status: 'loading' })
    setMore('idle')
    setHasMutationError(false)
    setAttempt(current => current + 1)
  }

  async function loadMore() {
    const controller = controllerRef.current
    if (!controller || isLoadingMore.current || state.status !== 'ready' || !state.page.nextCursor) return
    isLoadingMore.current = true
    setMore('loading')
    try {
      const next = await fetchFriendsList(kind, controller.signal, state.page.nextCursor)
      if (controller.signal.aborted) return
      setState(current => {
        if (current.status !== 'ready') return current
        const items = new Map(current.page.items.map(item => [item.id, item]))
        for (const item of next.items) items.set(item.id, item)
        return { status: 'ready', page: { ...next, items: [...items.values()] } }
      })
      setMore('idle')
    } catch {
      if (!controller.signal.aborted) setMore('error')
    } finally {
      isLoadingMore.current = false
    }
  }

  async function updateRequest(requestId: string) {
    if (kind === 'friends' || isSubmitting.current) return
    isSubmitting.current = true
    setSubmittingId(requestId)
    setHasMutationError(false)
    try {
      if (kind === 'incoming') {
        await acceptFriendRequest(requestId)
        onAccepted?.()
      } else {
        await cancelFriendRequest(requestId)
      }
      setState(current => current.status === 'ready' ? {
        ...current,
        page: { ...current.page, items: current.page.items.filter(item => item.id !== requestId) },
      } : current)
    } catch (error) {
      if (error instanceof ApiError && [404, 409].includes(error.status)) retry()
      else setHasMutationError(true)
    } finally {
      isSubmitting.current = false
      setSubmittingId(undefined)
    }
  }

  return { state, more, loadMore, retry, updateRequest, submittingId, hasMutationError }
}
