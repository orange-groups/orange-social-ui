import { useEffect, useState } from 'react'
import { ApiError } from '../../../lib/api-client'
import type { FriendRelationship } from '../../friends'
import { getPublicProfile } from '../api/profile.api'
import type { PublicProfile } from '../api/profile.api'

type ProfileState = { status: 'loading' | 'notFound' | 'error' }
  | { status: 'loaded'; profile: PublicProfile }

export function usePublicProfile(userId: string) {
  const [state, setState] = useState<ProfileState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    void getPublicProfile(userId, controller.signal).then(
      profile => { if (!controller.signal.aborted) setState({ status: 'loaded', profile }) },
      error => {
        if (controller.signal.aborted) return
        setState({ status: error instanceof ApiError && [400, 404].includes(error.status) ? 'notFound' : 'error' })
      },
    )
    return () => controller.abort()
  }, [userId, attempt])

  function retry() {
    setState({ status: 'loading' })
    setAttempt(current => current + 1)
  }

  function updateRelationship(relationship: FriendRelationship) {
    setState(current => current.status === 'loaded'
      ? { ...current, profile: { ...current.profile, relationship } }
      : current)
    if (relationship.status === 'friends') setAttempt(current => current + 1)
  }

  return { state, retry, updateRelationship }
}
