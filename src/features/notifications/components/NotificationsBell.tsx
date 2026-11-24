import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FeedIcon } from '../../feed/components/FeedIcon'
import { useNotifications } from '../notifications-context'
import './notifications.css'

export function NotificationsBell() {
  const { t } = useTranslation('social')
  const { unreadCount } = useNotifications()
  return <Link className="feed-icon-button notifications-bell" to="/notifications"
    aria-label={unreadCount ? t('notificationInbox.unreadLabel', { count: unreadCount }) : t('notifications.title')}>
    <FeedIcon name="bell" />
    {!!unreadCount && <span className="notifications-badge" aria-hidden="true">{unreadCount > 99 ? '99+' : unreadCount}</span>}
  </Link>
}
