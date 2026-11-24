import { useEffect, useRef, useState } from 'react'
import { searchUsers } from '../api/users.api'
import type { UserSearchPageData } from '../api/users.api'

type SearchState =
  | { status: 'loading' | 'error' }
  | { status: 'ready'; page: UserSearchPageData }

export function useUserSearch(query: string) {
  const [state, setState] = useState<SearchState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [moreStatus, setMoreStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const controllerRef = useRef<AbortController | null>(null)
  const isLoadingMore = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    controllerRef.current = controller
    void searchUsers(query, controller.signal).then(
      page => { if (!controller.signal.aborted) setState({ status: 'ready', page }) },
      () => { if (!controller.signal.aborted) setState({ status: 'error' }) },
    )
    return () => controller.abort()
  }, [query, attempt])

  function retry() {
    setState({ status: 'loading' })
    setAttempt(current => current + 1)
  }

  async function loadMore() {
    const controller = controllerRef.current
    if (!controller || isLoadingMore.current || state.status !== 'ready' || !state.page.nextCursor) return
    isLoadingMore.current = true
    setMoreStatus('loading')
    try {
      const next = await searchUsers(query, controller.signal, state.page.nextCursor)
      if (controller.signal.aborted) return
      setState(current => {
        if (current.status !== 'ready') return current
        const items = new Map(current.page.items.map(user => [user.id, user]))
        for (const user of next.items) items.set(user.id, user)
        return { status: 'ready', page: { ...next, items: [...items.values()] } }
      })
      setMoreStatus('idle')
    } catch {
      if (!controller.signal.aborted) setMoreStatus('error')
    } finally {
      isLoadingMore.current = false
    }
  }

  return { state, retry, loadMore, moreStatus }
}
