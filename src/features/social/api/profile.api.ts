import { apiRequest } from '../../../lib/api-client'
import type { FriendRelationship } from '../../friends'

export type PublicProfile = {
  id: string
  username: string
  fullName: string
  avatarUrl: string | null
  coverUrl: string | null
  bio: string | null
  friendCount: number
  relationship: FriendRelationship
  createdAt: string
}

export function getPublicProfile(userId: string, signal: AbortSignal) {
  return apiRequest<PublicProfile>(`/profile/${encodeURIComponent(userId)}`, { signal })
}

export function updateAvatar(file: File) {
  const body = new FormData()
  body.append('file', file)
  return apiRequest<{ avatarUrl: string }>('/profile/me/avatar', { method: 'POST', body })
}

export function updateCover(file: File) {
  const body = new FormData()
  body.append('file', file)
  return apiRequest<{ coverUrl: string }>('/profile/me/cover', { method: 'POST', body })
}
