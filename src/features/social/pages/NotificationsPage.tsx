import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { useNotificationsInbox } from '../../notifications'
import { SocialLayout } from '../components/SocialLayout'

export function NotificationsPage() {
  const { t, i18n } = useTranslation('social')
  usePageTitle(t('notifications.title'))
  const {
    items, unreadCount, isLoading, listError, actionError, isUpdating,
    canLoadMore, moreStatus, retry, markRead, loadMore,
  } = useNotificationsInbox()
  const formatTime = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })

  return <SocialLayout title={t('notifications.title')}>
    <section className="social-card">
      <div className="social-card-head">
        <h2>{t('notifications.inbox')} {unreadCount !== null && <span>{unreadCount}</span>}</h2>
        <button type="button" disabled={isUpdating || !unreadCount} onClick={() => void markRead()}>{t('notifications.markAll')}</button>
      </div>
      {isLoading && <p role="status">{t('notificationInbox.loading')}</p>}
      {listError && <><p role="alert">{t('notificationInbox.loadError')}</p><button type="button" className="feed-primary" onClick={retry}>{t('personalProfile.retry')}</button></>}
      {actionError && <p role="alert">{t('notificationInbox.updateError')}</p>}
      {!isLoading && !listError && !items.length && <p>{t('notificationInbox.empty')}</p>}
      <ul className="social-notices">{items.map(item => {
        const { type, actor, target } = item
        const key = type === 'friend_request_received' ? 'friendRequest'
          : type === 'friend_request_accepted' ? 'friendAccepted'
          : type === 'post_reacted' ? 'reaction'
          : type === 'post_commented' ? 'comment' : null
        const message = key && actor ? t(`notificationInbox.${key}`, { name: actor.fullName }) : item.content
        const href = target?.type === 'friend_request' ? '/friends'
          : target?.type === 'user' ? `/profile/${encodeURIComponent(target.id)}` : null
        return <li className={item.isRead ? '' : 'unread'} key={item.id}>
          <span className="social-notice-dot" aria-hidden="true" />
          <div>
            {href ? <Link to={href}>{message}</Link> : <span>{message}</span>}
            <small><time dateTime={item.createdAt}>{formatTime.format(new Date(item.createdAt))}</time></small>
          </div>
          {!item.isRead && <button type="button" disabled={isUpdating} onClick={() => void markRead(item.id)}>{t('notifications.markRead')}</button>}
        </li>
      })}</ul>
      {moreStatus === 'error' && <p role="alert">{t('notificationInbox.loadError')}</p>}
      {canLoadMore && <button type="button" className="feed-primary" disabled={moreStatus === 'loading'} onClick={() => void loadMore()}>{t('notificationInbox.more')}</button>}
    </section>
  </SocialLayout>
}
