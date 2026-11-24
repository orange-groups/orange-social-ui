import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { FriendRequestActions } from '../../friends'
import { PublicPostsSection } from '../../posts'
import { SocialLayout } from '../components/SocialLayout'
import { usePublicProfile } from '../hooks/usePublicProfile'

const UUID = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i

export function PublicProfilePage() {
  const { userId } = useParams()
  return userId && UUID.test(userId)
    ? <PublicProfileView key={userId} userId={userId} />
    : <ProfileNotFound />
}

function ProfileNotFound() {
  const { t } = useTranslation('social')
  usePageTitle(t('publicProfile.title'))
  return <SocialLayout title={t('publicProfile.title')}>
    <section className="social-card">
      <p role="status">{t('publicProfile.notFound')}</p>
      <Link to="/profile" className="social-text-link">{t('publicProfile.back')}</Link>
    </section>
  </SocialLayout>
}

function PublicProfileView({ userId }: { userId: string }) {
  const { t, i18n } = useTranslation('social')
  const { state, retry, updateRelationship } = usePublicProfile(userId)
  const profile = state.status === 'loaded' ? state.profile : null
  const title = profile?.fullName ?? t('publicProfile.title')
  usePageTitle(title)

  return <SocialLayout title={title}>
    <div className="social-stack">
      {state.status === 'loading' && <p className="social-card" role="status">{t('personalProfile.loading')}</p>}
      {state.status === 'notFound' && <section className="social-card">
        <p role="status">{t('publicProfile.notFound')}</p>
        <Link to="/profile" className="social-text-link">{t('publicProfile.back')}</Link>
      </section>}
      {state.status === 'error' && <section className="social-card">
        <p role="alert">{t('publicProfile.error')}</p>
        <button type="button" className="feed-primary" onClick={retry}>{t('personalProfile.retry')}</button>
      </section>}
      {profile && <>
        <section className="social-card social-profile-hero">
          <div className="social-cover" style={profile.coverUrl ? { backgroundImage: `url(${profile.coverUrl})` } : undefined} />
          <div className="social-profile-summary">
            {profile.avatarUrl
              ? <img className="social-profile-avatar" src={profile.avatarUrl} alt={t('profile.avatar')} />
              : <span className="social-profile-avatar feed-self" aria-hidden="true">{profile.fullName.charAt(0).toUpperCase()}</span>}
            <div><h2>{profile.fullName}</h2><p>@{profile.username}</p></div>
          </div>
          <div className="social-upload-actions">
            <span>{t('publicProfile.friendCount', { count: profile.friendCount })}</span>
            <FriendRequestActions receiverId={profile.id} relationship={profile.relationship} onChange={updateRelationship} onStale={retry} />
            {profile.relationship.status === 'self' && <Link to="/profile" className="social-text-link">{t('publicProfile.back')}</Link>}
          </div>
        </section>
        <section className="social-card">
          <h2>{t('publicProfile.about')}</h2>
          <p className="social-profile-bio">{profile.bio ?? t('personalProfile.notProvided')}</p>
          <p>{t('publicProfile.joined', {
            date: new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(new Date(profile.createdAt)),
          })}</p>
        </section>
        <PublicPostsSection authorId={profile.id} />
      </>}
    </div>
  </SocialLayout>
}
