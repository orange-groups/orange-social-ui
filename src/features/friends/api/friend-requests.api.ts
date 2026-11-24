import { apiRequest } from '../../../lib/api-client'

export type FriendRelationship = {
  status: 'self' | 'none' | 'outgoing_request' | 'incoming_request' | 'friends'
  requestId: string | null
}

export function sendFriendRequest(receiverId: string) {
  return apiRequest<{ id: string; status: 'pending' }>('/friends/requests', {
    method: 'POST',
    body: JSON.stringify({ receiverId }),
  })
}

export function cancelFriendRequest(requestId: string) {
  return apiRequest<{ requestId: string; status: 'cancelled' }>(`/friends/requests/${encodeURIComponent(requestId)}`, {
    method: 'DELETE',
  })
}

export function acceptFriendRequest(requestId: string) {
  return apiRequest<{ requestId: string; status: 'accepted' }>(`/friends/requests/${encodeURIComponent(requestId)}/accept`, {
    method: 'POST',
  })
}
