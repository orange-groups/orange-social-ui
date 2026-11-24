import { useRef, useState } from 'react'
import { ApiError } from '../../../lib/api-client'
import { acceptFriendRequest, cancelFriendRequest, sendFriendRequest } from '../api/friend-requests.api'
import type { FriendRelationship } from '../api/friend-requests.api'

export function useFriendRequest({ receiverId, relationship, onChange, onStale }: {
  receiverId: string
  relationship: FriendRelationship
  onChange: (relationship: FriendRelationship) => void
  onStale: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)
  const isPending = useRef(false)
  const canSend = relationship.status === 'none'
  const requestId = relationship.requestId
  const canAccept = relationship.status === 'incoming_request' && !!requestId
  const canCancel = relationship.status === 'outgoing_request' && !!requestId

  async function submit() {
    if (isPending.current || (!canSend && !canAccept && !canCancel)) return
    isPending.current = true
    setIsSubmitting(true)
    setHasError(false)
    try {
      if (requestId && canAccept) {
        await acceptFriendRequest(requestId)
        onChange({ status: 'friends', requestId: null })
      } else if (requestId && canCancel) {
        await cancelFriendRequest(requestId)
        onChange({ status: 'none', requestId: null })
      } else {
        const request = await sendFriendRequest(receiverId)
        onChange({ status: 'outgoing_request', requestId: request.id })
      }
    } catch (error) {
      if (error instanceof ApiError && [404, 409].includes(error.status)) onStale()
      else setHasError(true)
    } finally {
      isPending.current = false
      setIsSubmitting(false)
    }
  }

  return { canSend, canAccept, canCancel, isSubmitting, hasError, submit }
}
