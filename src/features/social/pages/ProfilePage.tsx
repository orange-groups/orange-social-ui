import { useTranslation } from 'react-i18next'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { OwnPostsSection } from '../../posts'
import { SocialLayout } from '../components/SocialLayout'
import { PersonalProfileDetails } from '../components/PersonalProfileDetails'
import { ChangePasswordCard } from '../components/ChangePasswordCard'
import { ProfileShareLink } from '../components/ProfileShareLink'
import { usePersonalProfile } from '../hooks/usePersonalProfile'
import { useUpdateAvatar } from '../hooks/useUpdateAvatar'

export function ProfilePage() {
  const { t } = useTranslation('social')
  usePageTitle(t('profile.title'))
  const {
    state: personalProfile, retry: retryPersonalProfile, save: savePersonalProfile,
    coverStatus, canUpdateCover, saveCover,
  } = usePersonalProfile()
  const { user, status, handleAvatar } = useUpdateAvatar()
  const coverUrl = personalProfile.status === 'loaded' ? personalProfile.profile.coverUrl : null
  return <SocialLayout title={t('profile.title')}>
    <div className="social-stack">
      <section className="social-card social-profile-hero">
        <div className="social-cover" style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined} />
        <div className="social-profile-summary">
          {user?.avatarUrl
            ? <img className="social-profile-avatar" src={user.avatarUrl} alt={t('profile.avatar')} />
            : <span className="social-profile-avatar feed-self">{user?.fullName.charAt(0).toUpperCase()}</span>}
          <div><h2>{personalProfile.status === 'loaded' ? personalProfile.profile.fullName : t('profile.title')}</h2>
            {personalProfile.status === 'loaded' && <p>@{personalProfile.profile.username}</p>}
          </div>
        </div>
        <div className="social-upload-actions">
          <label>
            {t('profile.changeAvatar')}
            <input type="file" accept="image/jpeg,image/png,image/webp" disabled={status === 'uploading' || !user}
              onChange={event => {
                const file = event.currentTarget.files?.[0]
                event.currentTarget.value = ''
                void handleAvatar(file)
              }}
            />
          </label>
          <label>
            {t('profile.changeCover')}
            <input type="file" accept="image/jpeg,image/png,image/webp" disabled={coverStatus === 'uploading' || !canUpdateCover}
              onChange={event => {
                const file = event.currentTarget.files?.[0]
                event.currentTarget.value = ''
                void saveCover(file)
              }}
            />
          </label>
        </div>
        {user && <div className="social-profile-share"><ProfileShareLink key={user.id} userId={user.id} /></div>}
        {status !== 'idle' && <p className="social-feedback" role={status === 'invalid' || status === 'error' ? 'alert' : 'status'}>
          {t(`profile.avatarStatus.${status}`)}
        </p>}
        {coverStatus !== 'idle' && <p className="social-feedback" role={coverStatus === 'invalid' || coverStatus === 'error' ? 'alert' : 'status'}>
          {t(`profile.coverStatus.${coverStatus}`)}
        </p>}
      </section>
      <PersonalProfileDetails state={personalProfile} onRetry={retryPersonalProfile} onSave={savePersonalProfile} />
      <ChangePasswordCard />
      {user && <OwnPostsSection key={user.id} />}
    </div>
  </SocialLayout>
}
