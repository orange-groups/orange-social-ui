import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AppearanceControls } from '../preferences/AppearanceControls'
import { AppSidebar } from './AppSidebar'
import { AppRightRail } from './AppRightRail'
import { useSession } from '../../features/auth'
import { UserSearchBar } from '../../features/users'
import { NotificationsBell, NotificationsProvider } from '../../features/notifications'
import '../../features/feed/feed.css'

export function AppShell() {
  const { t } = useTranslation('home')
  const location = useLocation()
  const hasRightRail = location.pathname === '/home'
  const { user } = useSession()
  const initial = user?.fullName.charAt(0).toUpperCase()
  const query = location.pathname === '/search' ? new URLSearchParams(location.search).get('q') ?? '' : ''
  if (!user) return null
  return <NotificationsProvider key={user.id}><div className="orange-feed">
    <header className="feed-header"><Link className="feed-brand" to="/home" aria-label="Orange Social">orange<span>.</span></Link><UserSearchBar key={query} initialQuery={query} /><div className="feed-header-right"><AppearanceControls /><NotificationsBell /><Link className="feed-avatar feed-self feed-avatar-link" to="/profile" aria-label={t('profile')}>{initial}</Link></div></header>
    <div className={`feed-layout${hasRightRail ? '' : ' feed-layout--two-column'}`}><AppSidebar /><main className="feed-main"><Outlet /></main>{hasRightRail && <AppRightRail />}</div>
  </div></NotificationsProvider>
}
