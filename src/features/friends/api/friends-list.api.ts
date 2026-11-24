import { apiRequest } from '../../../lib/api-client'

export type FriendsListKind = 'friends' | 'incoming' | 'outgoing'
type UserSummary = { id: string; username: string; fullName: string; avatarUrl: string | null }
type FriendItem = UserSummary & { friendsSince: string }
type RequestItem = { id: string; user: UserSummary; createdAt: string }
type Page<T> = { items: T[]; nextCursor: string | null; hasMore: boolean }

export async function fetchFriendsList(kind: FriendsListKind, signal: AbortSignal, cursor?: string): Promise<Page<RequestItem>> {
  const params = new URLSearchParams()
  if (cursor) params.set('cursor', cursor)
  if (kind !== 'friends') {
    params.set('direction', kind)
    return apiRequest(`/friends/requests?${params}`, { signal })
  }

  const page = await apiRequest<Page<FriendItem>>(params.size ? `/friends?${params}` : '/friends', { signal })
  return {
    ...page,
    items: page.items.map(({ friendsSince, ...user }) => ({ id: user.id, user, createdAt: friendsSince })),
  }
}
