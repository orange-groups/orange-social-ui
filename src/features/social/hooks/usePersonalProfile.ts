import { useEffect, useRef, useState } from 'react'
import { ApiError } from '../../../lib/api-client'
import { updateSessionFullName, useSession } from '../../auth'
import { getPersonalProfile, updatePersonalProfile } from '../api/personal-profile.api'
import type { PersonalProfile, PersonalProfilePatch } from '../api/personal-profile.api'
import { updateCover } from '../api/profile.api'

const MAX_COVER_BYTES = 5 * 1024 * 1024
const COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp']
type CoverStatus = 'idle' | 'uploading' | 'success' | 'invalid' | 'error'

export type PersonalProfileState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; profile: PersonalProfile }

export function usePersonalProfile() {
  const { user } = useSession()
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<PersonalProfileState>({ status: 'loading' })
  const [coverStatus, setCoverStatus] = useState<CoverStatus>('idle')
  const isCoverPending = useRef(false)
  const canUpdateCover = !!user && state.status === 'loaded' && state.profile.id === user.id

  useEffect(() => {
    const controller = new AbortController()
    void getPersonalProfile(controller.signal).then(
      profile => { if (!controller.signal.aborted) setState({ status: 'loaded', profile }) },
      () => { if (!controller.signal.aborted) setState({ status: 'error' }) },
    )
    return () => controller.abort()
  }, [attempt])

  function retry() {
    setState({ status: 'loading' })
    setAttempt(current => current + 1)
  }

  async function save(changes: PersonalProfilePatch) {
    const profile = await updatePersonalProfile(changes)
    setState(current => current.status === 'loaded' && current.profile.id === profile.id
      ? { status: 'loaded', profile: { ...profile, coverUrl: current.profile.coverUrl } }
      : { status: 'loaded', profile })
    if (changes.fullName !== undefined) updateSessionFullName(profile.id, profile.fullName)
  }

  async function saveCover(file: File | undefined) {
    if (!file || !user || !canUpdateCover || isCoverPending.current) return
    if (!file.size || file.size > MAX_COVER_BYTES || !COVER_TYPES.includes(file.type)) {
      setCoverStatus('invalid')
      return
    }

    isCoverPending.current = true
    setCoverStatus('uploading')
    try {
      const { coverUrl } = await updateCover(file)
      setState(current => current.status === 'loaded' && current.profile.id === user.id
        ? { status: 'loaded', profile: { ...current.profile, coverUrl } }
        : current)
      setCoverStatus('success')
    } catch (error) {
      setCoverStatus(error instanceof ApiError && [400, 413, 415].includes(error.status) ? 'invalid' : 'error')
    } finally {
      isCoverPending.current = false
    }
  }

  return { state, retry, save, coverStatus, canUpdateCover, saveCover }
}
