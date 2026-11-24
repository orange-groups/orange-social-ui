import { apiRequest } from '../../../lib/api-client'
import type { FriendRelationship } from '../../friends'

export type UserSearchResult = {
  id: string
  fullName: string
  username: string
  avatarUrl: string | null
  relationship: FriendRelationship
}

export type UserSearchPageData = {
  items: UserSearchResult[]
  nextCursor: string | null
  hasMore: boolean
}

export function searchUsers(query: string, signal: AbortSignal, cursor?: string) {
  const params = new URLSearchParams({ q: query })
  if (cursor) params.set('cursor', cursor)
  return apiRequest<UserSearchPageData>(`/users?${params}`, { signal })
}
