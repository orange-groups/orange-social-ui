import { apiRequest } from '../../../lib/api-client'

export type PersonalProfile = {
  username: string
  fullName: string
  bio: string | null
  dateOfBirth: string | null
}

export function getPersonalProfile(signal: AbortSignal): Promise<PersonalProfile> {
  return apiRequest('/profile/me', { signal })
}
