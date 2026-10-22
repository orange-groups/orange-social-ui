import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { members, photoUrl } from '../../feed/feed.data'
import { SocialLayout } from '../components/SocialLayout'

type Relationship = 'incoming' | 'friend' | 'suggested' | 'sent' | 'dismissed'
const initial: Relationship[] = ['incoming', 'incoming', 'suggested', 'friend']
export function FriendsPage() {
  const { t } = useTranslation('social')
  usePageTitle(t('friends.title'))
  const [relationships, setRelationships] = useState(initial)
  function change(index: number, next: Relationship) { setRelationships(current => current.map((value, i) => i === index ? next : value)) }
  const groups: { status: Relationship; title: string }[] = [{ status: 'incoming', title: t('friends.requests') }, { status: 'sent', title: t('friends.sent') }, { status: 'friend', title: t('friends.yourFriends') }, { status: 'suggested', title: t('friends.suggestions') }]
  return <SocialLayout title={t('friends.title')} description={t('friends.description')}><div className="social-stack">{groups.map(group => <section className="social-card" key={group.status}><h2>{group.title}<span>{relationships.filter(status => status === group.status).length}</span></h2><div className="social-people">{members.map((person, index) => relationships[index] === group.status && <div className="social-person" key={person.name}><img className="feed-avatar" src={photoUrl(person.image)} alt="" /><div className="social-person-info"><strong>{person.name}</strong><small>{t('friends.mutual', { count: 3 + index * 2 })}</small>{group.status === 'sent' && <small>{t('friends.following')}</small>}</div><div className="social-actions">{group.status === 'incoming' && <><button className="feed-primary" onClick={() => change(index, 'friend')}>{t('friends.accept')}</button><button onClick={() => change(index, 'dismissed')}>{t('friends.reject')}</button></>}{group.status === 'sent' && <button onClick={() => change(index, 'suggested')}>{t('friends.cancel')}</button>}{group.status === 'friend' && <button onClick={() => change(index, 'suggested')}>{t('friends.unfriend')}</button>}{group.status === 'suggested' && <button className="feed-primary" onClick={() => change(index, 'sent')}>{t('friends.add')}</button>}</div></div>)}</div>{!relationships.includes(group.status) && <p className="feed-muted">{t('friends.empty')}</p>}</section>)}</div></SocialLayout>
}
