import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { FeedIcon } from '../../features/feed/components/FeedIcon'
import { useLogout, useSession } from '../../features/auth'

const links = [
  { to: '/home', key: 'feed', icon: 'home' },
  { to: '/friends', key: 'friends', icon: 'friends' },
  { to: '/profile', key: 'profile', icon: 'friends' },
  { to: '/notifications', key: 'notifications', icon: 'comment' },
  { to: '/saved', key: 'saved', icon: 'save' },
] as const

export function AppSidebar() {
  const { t } = useTranslation('home')
  const { user } = useSession()
  const { isLoggingOut, handleLogout } = useLogout()
  return <aside className="feed-left app-sidebar">
    <div className="feed-profile"><span className="feed-avatar feed-self">{user?.fullName.charAt(0).toUpperCase()}</span><div><strong>{user?.fullName}</strong><small>{t('welcome')}</small></div></div>
    <nav className="feed-nav" aria-label={t('navigation')}>{links.map(link => <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : undefined}><FeedIcon name={link.icon} />{t(link.key)}</NavLink>)}</nav>
    <div className="feed-side-bottom"><p>{t('note')}</p><button className="feed-logout" type="button" onClick={() => void handleLogout()} disabled={isLoggingOut}><FeedIcon name="logout" />{t('logout')}</button><small>© 2026 Orange Social</small></div>
  </aside>
}
