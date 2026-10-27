import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppearanceControls } from '../preferences/AppearanceControls'
import { FeedIcon } from '../../features/feed/components/FeedIcon'
import { AppSidebar } from './AppSidebar'
import { AppRightRail } from './AppRightRail'
import { useSession } from '../../features/auth'
import '../../features/feed/feed.css'

export function AppShell() {
  const { t } = useTranslation('home')
  const navigate = useNavigate()
  const location = useLocation()
  const hasRightRail = location.pathname === '/home'
  const initial = useSession().user?.fullName.charAt(0).toUpperCase()
  const [search, setSearch] = useState(() => new URLSearchParams(location.search).get('q') ?? '')
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/home?q=${encodeURIComponent(query)}` : '/home')
  }
  return <div className="orange-feed">
    <header className="feed-header"><Link className="feed-brand" to="/home" aria-label="Orange Social">orange<span>.</span></Link><form className="feed-search" role="search" onSubmit={submitSearch}><FeedIcon name="search" /><input type="search" placeholder={t('search')} aria-label={t('search')} value={search} onChange={event => setSearch(event.target.value)} /></form><div className="feed-header-right"><AppearanceControls /><Link className="feed-icon-button" to="/notifications" aria-label={t('notifications')}><FeedIcon name="comment" /></Link><Link className="feed-avatar feed-self feed-avatar-link" to="/profile" aria-label={t('profile')}>{initial}</Link></div></header>
    <div className={`feed-layout${hasRightRail ? '' : ' feed-layout--two-column'}`}><AppSidebar /><main className="feed-main"><Outlet /></main>{hasRightRail && <AppRightRail />}</div>
  </div>
}
