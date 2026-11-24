import { useTranslation } from 'react-i18next'
import { useProfilePosts } from '../hooks/useProfilePosts'
import { PersonalPostComposer } from './PersonalPostComposer'
import '../../feed/feed.css'

export function OwnPostsSection() {
  return <ProfilePostsSection />
}

export function PublicPostsSection({ authorId }: { authorId: string }) {
  return <ProfilePostsSection key={authorId} authorId={authorId} />
}

function ProfilePostsSection({ authorId }: { authorId?: string }) {
  const { t, i18n } = useTranslation('social')
  const { posts, status, cursor, moreStatus, retry, add, loadMore } = useProfilePosts(authorId)
  const formatTime = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })
  const titleId = authorId ? 'public-posts-title' : 'own-posts-title'

  return <section className="social-card social-stack" aria-labelledby={titleId}>
    <h2 id={titleId}>{t(authorId ? 'publicPosts.title' : 'profile.posts')}</h2>
    {!authorId && <PersonalPostComposer onPublish={add} />}
    {status === 'loading' && <p role="status">{t('ownPosts.loading')}</p>}
    {status === 'error' && <>
      <p role="alert">{t('ownPosts.loadError')}</p>
      <button type="button" className="feed-primary" onClick={retry}>{t('personalProfile.retry')}</button>
    </>}
    {status === 'ready' && posts.length === 0 && <p>{t(authorId ? 'publicPosts.empty' : 'ownPosts.empty')}</p>}
    {posts.map(post => <article className="feed-card feed-post-card" key={post.id}>
      <header className="feed-person">
        {post.author.avatarUrl
          ? <img className="feed-avatar" src={post.author.avatarUrl} alt="" />
          : <span className="feed-avatar feed-self">{post.author.fullName.charAt(0).toUpperCase()}</span>}
        <div><strong>{post.author.fullName}</strong><small>
          <time dateTime={post.createdAt}>{formatTime.format(new Date(post.createdAt))}</time>
          {' · '}{t(`ownPosts.${post.privacy}`)}
        </small></div>
      </header>
      {post.content && <p className="feed-post-copy">{post.content}</p>}
      {post.media.length > 0 && <div className="feed-media-grid">{post.media.map((media, index) => media.type === 'image'
        ? <img key={media.id} src={media.url} alt={t('ownPosts.image', { number: index + 1 })} loading="lazy" />
        : <video key={media.id} src={media.url} controls preload="metadata" aria-label={t('ownPosts.video')} />)}</div>}
    </article>)}
    {moreStatus === 'error' && <p role="alert">{t('ownPosts.loadError')}</p>}
    {cursor && <button type="button" className="feed-primary" disabled={moreStatus === 'loading'} onClick={() => void loadMore()}>
      {t(moreStatus === 'loading' ? 'ownPosts.loading' : 'ownPosts.more')}
    </button>}
  </section>
}
