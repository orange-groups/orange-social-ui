import { createContext, useContext } from 'react'

type NotificationsContextValue = {
  unreadCount: number | null
  revision: number
  invalidate: () => void
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function useNotifications() {
  const value = useContext(NotificationsContext)
  if (!value) throw new Error('NotificationsProvider is missing.')
  return value
}
