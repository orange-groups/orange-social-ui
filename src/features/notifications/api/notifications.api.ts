import { apiRequest } from '../../../lib/api-client'

export type NotificationItem = {
  id: string
  type: string
  actor: { id: string; fullName: string } | null
  content: string
  target: { type: 'friend_request' | 'user' | 'post'; id: string } | null
  isRead: boolean
  createdAt: string
}

type NotificationPage = { items: NotificationItem[]; nextCursor: string | null }

export function getNotifications(signal: AbortSignal, cursor?: string) {
  const query = cursor ? `?${new URLSearchParams({ cursor })}` : ''
  return apiRequest<NotificationPage>(`/notifications${query}`, { signal })
}

export function getUnreadCount(signal: AbortSignal) {
  return apiRequest<{ unreadCount: number }>('/notifications/unread-count', { signal })
}

export function markNotificationRead(id: string) {
  return apiRequest(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' })
}

export function markAllNotificationsRead() {
  return apiRequest('/notifications/read-all', { method: 'PATCH' })
}
