import { apiRequest } from '../../../lib/api-client'

export type PersonalProfile = {
  id: string
  username: string
  fullName: string
  bio: string | null
  dateOfBirth: string | null
}

export type PersonalProfilePatch = Partial<Pick<PersonalProfile, 'fullName' | 'bio' | 'dateOfBirth'>>

export function getPersonalProfile(signal: AbortSignal): Promise<PersonalProfile> {
  return apiRequest('/profile/me', { signal })
}

export function updatePersonalProfile(changes: PersonalProfilePatch): Promise<PersonalProfile> {
  return apiRequest('/profile/me', { method: 'PATCH', body: JSON.stringify(changes) })
}
