import { useRef, useState } from 'react'
import { ApiError } from '../../../lib/api-client'
import { updateSessionAvatar, useSession } from '../../auth'
import { updateAvatar } from '../api/profile.api'

const MAX_AVATAR_BYTES = 2 * 1024 * 1024
const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']
type AvatarStatus = 'idle' | 'uploading' | 'success' | 'invalid' | 'error'

export function useUpdateAvatar() {
  const { user } = useSession()
  const [status, setStatus] = useState<AvatarStatus>('idle')
  const isPending = useRef(false)

  async function handleAvatar(file: File | undefined) {
    if (!file || !user || isPending.current) return
    if (!file.size || file.size > MAX_AVATAR_BYTES || !AVATAR_TYPES.includes(file.type)) {
      setStatus('invalid')
      return
    }

    isPending.current = true
    setStatus('uploading')
    try {
      const { avatarUrl } = await updateAvatar(file)
      updateSessionAvatar(user.id, avatarUrl)
      setStatus('success')
    } catch (error) {
      setStatus(error instanceof ApiError && [400, 413, 415].includes(error.status) ? 'invalid' : 'error')
    } finally {
      isPending.current = false
    }
  }

  return { user, status, handleAvatar }
}
