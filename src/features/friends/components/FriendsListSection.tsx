import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { FriendsListKind } from '../api/friends-list.api'
import { useFriendsList } from '../hooks/useFriendsList'
import './friends-list.css'

const titles = { friends: 'friends.yourFriends', incoming: 'friends.requests', outgoing: 'friends.sent' } as const

export function FriendsListSection({ kind, onAccepted }: { kind: FriendsListKind; onAccepted?: () => void }) {
  const { t } = useTranslation('social')
  const headingId = useId()
  const { state, more, loadMore, retry, updateRequest, submittingId, hasMutationError } = useFriendsList(kind, onAccepted)

  return <section className="social-card" aria-labelledby={headingId}>
    <h2 id={headingId}>{t(titles[kind])}</h2>
    {state.status === 'loading' && <p role="status">{t('friendsList.loading')}</p>}
    {state.status === 'error' && <>
      <p role="alert">{t('friendsList.error')}</p>
      <button type="button" className="feed-primary" onClick={retry}>{t('personalProfile.retry')}</button>
    </>}
    {state.status === 'ready' && <>
      {!state.page.items.length && <p className="feed-muted">{t('friends.empty')}</p>}
      {!!state.page.items.length && <ul className="friends-list">
        {state.page.items.map(({ id, user }) => <li key={id} className="social-person">
          <Link to={`/profile/${encodeURIComponent(user.id)}`} className="friends-list-person">
            {user.avatarUrl ? <img className="feed-avatar" src={user.avatarUrl} alt="" loading="lazy" />
              : <span className="feed-avatar feed-self" aria-hidden="true">{user.fullName.charAt(0).toUpperCase()}</span>}
            <div className="social-person-info"><strong>{user.fullName}</strong><small>@{user.username}</small></div>
          </Link>
          {kind !== 'friends' && <button type="button" className={kind === 'incoming' ? 'feed-primary' : 'friends-list-cancel'}
            disabled={!!submittingId} aria-busy={submittingId === id} onClick={() => void updateRequest(id)}>
            {submittingId === id ? t('friendRequests.saving') : t(kind === 'incoming' ? 'friends.accept' : 'friends.cancel')}
          </button>}
        </li>)}
      </ul>}
      {hasMutationError && <p role="alert">{t('friendRequests.error')}</p>}
      {more === 'error' && <p role="alert">{t('friendsList.error')}</p>}
      {state.page.nextCursor && <button type="button" className="feed-primary" disabled={more === 'loading'} onClick={() => void loadMore()}>
        {t(more === 'loading' ? 'friendsList.loading' : more === 'error' ? 'personalProfile.retry' : 'friendsList.more')}
      </button>}
    </>}
  </section>
}
