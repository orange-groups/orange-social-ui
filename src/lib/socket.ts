import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { API_BASE_URL, getAccessToken } from './api-client'

type ServerEvents = { 'notifications:changed': () => void }

export function createNotificationsSocket(): Socket<ServerEvents, never> {
  const origin = new URL(API_BASE_URL || '/', window.location.origin).origin
  return io(origin, {
    path: '/notifications/socket.io',
    transports: ['websocket'],
    autoConnect: false,
    auth: callback => callback({ accessToken: getAccessToken() }),
  })
}
