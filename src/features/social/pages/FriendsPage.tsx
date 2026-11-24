import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { FriendsListSection } from '../../friends'
import { SocialLayout } from '../components/SocialLayout'

export function FriendsPage() {
  const { t } = useTranslation('social')
  const [friendsRevision, setFriendsRevision] = useState(0)
  usePageTitle(t('friends.title'))

  return <SocialLayout title={t('friends.title')}>
    <div className="social-stack">
      <FriendsListSection kind="incoming" onAccepted={() => setFriendsRevision(current => current + 1)} />
      <FriendsListSection kind="outgoing" />
      <FriendsListSection kind="friends" key={friendsRevision} />
    </div>
  </SocialLayout>
}
