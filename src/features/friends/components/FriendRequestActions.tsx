import { useTranslation } from 'react-i18next'
import type { FriendRelationship } from '../api/friend-requests.api'
import { useFriendRequest } from '../hooks/useFriendRequest'

export function FriendRequestActions(props: {
  receiverId: string
  relationship: FriendRelationship
  onChange: (relationship: FriendRelationship) => void
  onStale: () => void
}) {
  const { t } = useTranslation('social')
  const { canSend, canAccept, canCancel, isSubmitting, hasError, submit } = useFriendRequest(props)
  const { status } = props.relationship
  if (status === 'self') return null

  return <>
    <span role="status">{t(`publicProfile.relationship.${status}`)}</span>
    {(canSend || canAccept || canCancel) && <button type="button" className="feed-primary" disabled={isSubmitting} aria-busy={isSubmitting}
      onClick={() => void submit()}>
      {isSubmitting ? t('friendRequests.saving') : t(canSend ? 'friends.add' : canAccept ? 'friends.accept' : 'friends.cancel')}
    </button>}
    {hasError && <span role="alert">{t('friendRequests.error')}</span>}
  </>
}
