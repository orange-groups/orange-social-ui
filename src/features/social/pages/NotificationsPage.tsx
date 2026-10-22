import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { SocialLayout } from '../components/SocialLayout'

type Notice = { id: number; key: 'request' | 'reaction' | 'comment'; time: string; href: string; read: boolean }
const initial: Notice[] = [
  { id: 1, key: 'request', time: '10:24', href: '/friends', read: false },
  { id: 2, key: 'reaction', time: '09:12', href: '/home', read: false },
  { id: 3, key: 'comment', time: 'yesterday', href: '/home', read: true },
]
export function NotificationsPage() {
  const { t } = useTranslation('social')
  usePageTitle(t('notifications.title'))
  const [notices, setNotices] = useState(initial)
  function mark(id: number) { setNotices(current => current.map(item => item.id === id ? { ...item, read: true } : item)) }
  return <SocialLayout title={t('notifications.title')} description={t('notifications.description')}><section className="social-card"><div className="social-card-head"><h2>{t('notifications.inbox')} <span>{notices.filter(item => !item.read).length}</span></h2><button onClick={() => setNotices(current => current.map(item => ({ ...item, read: true })))}>{t('notifications.markAll')}</button></div><ul className="social-notices">{notices.map(item => <li className={item.read ? '' : 'unread'} key={item.id}><span className="social-notice-dot" /><div><Link to={item.href} onClick={() => mark(item.id)}>{t(`notifications.${item.key}`)}</Link><small>{item.time === 'yesterday' ? t('notifications.yesterday') : item.time}</small></div>{!item.read && <button onClick={() => mark(item.id)}>{t('notifications.markRead')}</button>}</li>)}</ul></section></SocialLayout>
}
