import { useEffect, useRef, useState } from 'react'
import { getProfilePosts } from '../api/posts.api'
import type { PersonalPost } from '../api/posts.api'

export function useProfilePosts(authorId?: string) {
  const [posts, setPosts] = useState<PersonalPost[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [cursor, setCursor] = useState<string | null>(null)
  const [moreStatus, setMoreStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [attempt, setAttempt] = useState(0)
  const request = useRef<AbortController | null>(null)
  const moreRequest = useRef<AbortController | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    request.current = controller
    void getProfilePosts(controller.signal, undefined, authorId).then(
      page => {
        if (controller.signal.aborted) return
        setPosts(current => {
          const ids = new Set(current.map(post => post.id))
          return [...current, ...page.items.filter(post => !ids.has(post.id))]
        })
        setCursor(page.nextCursor)
        setStatus('ready')
      },
      () => { if (!controller.signal.aborted) setStatus('error') },
    )
    return () => {
      controller.abort()
      moreRequest.current?.abort()
    }
  }, [attempt, authorId])

  function add(post: PersonalPost) {
    if (!request.current?.signal.aborted) {
      setPosts(current => [post, ...current.filter(item => item.id !== post.id)])
    }
  }

  async function loadMore() {
    if (!cursor || moreRequest.current) return
    const controller = new AbortController()
    moreRequest.current = controller
    setMoreStatus('loading')
    try {
      const page = await getProfilePosts(controller.signal, cursor, authorId)
      if (controller.signal.aborted) return
      setPosts(current => {
        const ids = new Set(current.map(post => post.id))
        return [...current, ...page.items.filter(post => !ids.has(post.id))]
      })
      setCursor(page.nextCursor)
      setMoreStatus('idle')
    } catch {
      if (!controller.signal.aborted) setMoreStatus('error')
    } finally {
      moreRequest.current = null
    }
  }

  function retry() {
    setStatus('loading')
    setAttempt(current => current + 1)
  }

  return { posts, status, cursor, moreStatus, retry, add, loadMore }
}
