import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import { FeedIcon } from '../../features/feed/components/FeedIcon'

const links = [
  { to: '/home', key: 'feed', icon: 'home' },
  { to: '/friends', key: 'friends', icon: 'friends' },
  { to: '/profile', key: 'profile', icon: 'friends' },
  { to: '/notifications', key: 'notifications', icon: 'comment' },
  { to: '/saved', key: 'saved', icon: 'save' },
] as const

export function AppSidebar() {
  const { t } = useTranslation('home')
  return <aside className="feed-left app-sidebar">
    <div className="feed-profile"><span className="feed-avatar feed-self">Q</span><div><strong>Trần Minh Quang</strong><small>{t('welcome')}</small></div></div>
    <nav className="feed-nav" aria-label={t('navigation')}>{links.map(link => <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : undefined}><FeedIcon name={link.icon} />{t(link.key)}</NavLink>)}</nav>
    <div className="feed-side-bottom"><p>{t('note')}</p><Link to="/login"><FeedIcon name="logout" />{t('logout')}</Link><small>© 2026 Orange Social</small></div>
  </aside>
}
