import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { FeedIcon } from '../components/FeedIcon'
import { PostCard } from '../components/PostCard'
import { PostComposer } from '../components/PostComposer'
import { members, photoUrl } from '../feed.data'
import { useFeedPosts } from '../useFeedPosts'
import '../feed.css'

export function HomePage() {
  const { t } = useTranslation('home')
  usePageTitle(t('title'))
  const { posts, publish, update } = useFeedPosts()
  const location = useLocation()
  const saved = location.pathname === '/saved'
  const search = new URLSearchParams(location.search).get('q') ?? ''
  const [notice, setNotice] = useState('')
  const visible = posts.filter(post => !post.deleted && (!saved || post.saved) && `${post.author} ${post.contentKey ? t(post.contentKey) : post.text}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  return <>
    <div className="feed-heading"><p>{t('eyebrow')}</p><h1>{saved ? t('saved') : t('hello')}</h1><span>{t('subtitle')}</span></div>
    {!saved && <><section className="feed-stories" aria-label={t('stories')}><div className="feed-section-title"><h2>{t('stories')}</h2></div><div className="feed-story-grid"><div className="feed-story-create"><span className="feed-story-plus"><FeedIcon name="plus" /></span><strong>{t('create')}</strong></div>{members.slice(0, 3).map(person => <div className="feed-story" key={person.name}><img className="feed-story-background" src={photoUrl(person.image, 400)} alt="" /><img className="feed-story-avatar" src={photoUrl(person.image)} alt="" /><strong>{person.name}</strong></div>)}</div></section><PostComposer onPublish={post => { publish(post); setNotice(t('posted')) }} /></>}
    <div className="feed-section-title feed-list-title"><h2>{t(saved ? 'saved' : 'forYou')}</h2><span className="feed-line" /></div>
    {visible.length === 0 && <div className="feed-card feed-empty"><FeedIcon name="search" /><h2>{t('empty')}</h2><p>{t('emptyHint')}</p></div>}
    {visible.map(post => <PostCard key={post.id} post={post} update={next => { update(next); if (next.deleted) setNotice(t('deleted')) }} />)}
  {notice && <div className="feed-toast" role="status"><span>{notice}</span><button aria-label={t('close')} onClick={() => setNotice('')}><FeedIcon name="close" /></button></div>}</>
}
