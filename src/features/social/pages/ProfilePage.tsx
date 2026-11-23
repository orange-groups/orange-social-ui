import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { Link } from 'react-router-dom'
import { useFeedPosts } from '../../feed/useFeedPosts'
import { PostCard } from '../../feed/components/PostCard'
import { SocialLayout } from '../components/SocialLayout'
import { PersonalProfileDetails } from '../components/PersonalProfileDetails'
import { usePersonalProfile } from '../hooks/usePersonalProfile'

const strongPassword = (value: string) => value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value)
export function ProfilePage() {
  const { t } = useTranslation('social')
  usePageTitle(t('profile.title'))
  const { posts, update } = useFeedPosts()
  const { state: personalProfile, retry: retryPersonalProfile } = usePersonalProfile()
  const [avatar, setAvatar] = useState<string>()
  const [cover, setCover] = useState<string>()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  function loadImage(file: File | undefined, update: (value: string) => void) {
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) { setMessage(t('profile.imageError')); return }
    const reader = new FileReader()
    reader.onload = () => { if (typeof reader.result === 'string') update(reader.result) }
    reader.readAsDataURL(file)
  }
  return <SocialLayout title={t('profile.title')} description={t('profile.description')}><div className="social-stack"><section className="social-card social-profile-hero"><div className="social-cover" style={cover ? { backgroundImage: `url(${cover})` } : undefined} /><div className="social-profile-summary">{avatar ? <img className="social-profile-avatar" src={avatar} alt={t('profile.avatar')} /> : <span className="social-profile-avatar feed-self">Q</span>}<div><h2>{personalProfile.status === 'loaded' ? personalProfile.profile.fullName : t('profile.title')}</h2>{personalProfile.status === 'loaded' && <p>@{personalProfile.profile.username}</p>}</div></div><div className="social-upload-actions"><label>{t('profile.changeAvatar')}<input type="file" accept="image/*" onChange={event => loadImage(event.target.files?.[0], setAvatar)} /></label><label>{t('profile.changeCover')}<input type="file" accept="image/*" onChange={event => loadImage(event.target.files?.[0], setCover)} /></label></div></section><PersonalProfileDetails state={personalProfile} onRetry={retryPersonalProfile} /><section className="social-card"><h2>{t('profile.password')}</h2><form className="social-form" onSubmit={event => { event.preventDefault(); if (!strongPassword(password)) { setMessage(t('profile.passwordRule')); return } setMessage(t('profile.saved')); setPassword('') }}><label>{t('profile.newPassword')}<input type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} /></label><p className="feed-muted">{t('profile.passwordRule')}</p><button className="feed-primary">{t('profile.changePassword')}</button></form></section><section className="social-card"><h2>{t('profile.posts')}</h2><p className="feed-muted">{t('profile.postsHint')}</p><Link className="social-text-link" to="/home">{t('profile.openFeed')}</Link></section>{posts.filter(post => post.own && !post.deleted).map(post => <PostCard key={post.id} post={post} update={update} />)}{message && <p className="social-feedback" role="status">{message}</p>}</div></SocialLayout>
}
