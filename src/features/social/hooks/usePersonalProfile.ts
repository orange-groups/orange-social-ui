import { useEffect, useState } from 'react'
import { getPersonalProfile } from '../api/personal-profile.api'
import type { PersonalProfile } from '../api/personal-profile.api'

export type PersonalProfileState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; profile: PersonalProfile }

export function usePersonalProfile() {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<PersonalProfileState>({ status: 'loading' })

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

  return { state, retry }
}
