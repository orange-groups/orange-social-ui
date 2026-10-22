import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { members, photoUrl } from '../../features/feed/feed.data'

export function AppRightRail() {
  const { t } = useTranslation('home')
  return <aside className="feed-right">
    <section className="feed-card feed-people-card"><h2>{t('requests')}</h2>{members.slice(0, 2).map(person => <div className="feed-suggestion" key={person.name}><div className="feed-person"><img className="feed-avatar" src={photoUrl(person.image)} alt="" /><div><strong>{person.name}</strong><small>{t('mutual', { count: 8 })}</small></div></div></div>)}<Link className="feed-side-link" to="/friends">{t('manageFriends')}</Link></section>
    <section className="feed-contacts"><h2><span className="feed-online-dot" />{t('contacts')}</h2>{members.map(person => <div className="feed-person" key={person.name}><img className="feed-avatar" src={photoUrl(person.image)} alt="" /><strong>{person.name}</strong></div>)}</section>
  </aside>
}
