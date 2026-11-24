import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../auth'
import type { PersonalProfilePatch } from '../api/personal-profile.api'
import type { PersonalProfileState } from '../hooks/usePersonalProfile'
import { PersonalProfileForm } from './PersonalProfileForm'

export function PersonalProfileDetails({ state, onRetry, onSave }: {
  state: PersonalProfileState
  onRetry: () => void
  onSave: (changes: PersonalProfilePatch) => Promise<void>
}) {
  const { t, i18n } = useTranslation('social')
  const { user } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)
  const notProvided = t('personalProfile.notProvided')

  async function save(changes: PersonalProfilePatch) {
    await onSave(changes)
    setIsEditing(false)
    setHasSaved(true)
  }

  return <section className="social-card">
    <h2>{t('profile.details')}</h2>
    {state.status === 'loading' && <p role="status">{t('personalProfile.loading')}</p>}
    {state.status === 'error' && <>
      <p role="alert">{t('personalProfile.error')}</p>
      <button type="button" className="feed-primary" onClick={onRetry}>{t('personalProfile.retry')}</button>
    </>}
    {state.status === 'loaded' && isEditing &&
      <PersonalProfileForm profile={state.profile} onSave={save} onCancel={() => setIsEditing(false)} />}
    {state.status === 'loaded' && !isEditing && <>
      <dl className="social-profile-details">
      <div><dt>{t('personalProfile.fullName')}</dt><dd>{state.profile.fullName}</dd></div>
      <div><dt>{t('personalProfile.username')}</dt><dd>@{state.profile.username}</dd></div>
      <div><dt>{t('profile.email')}</dt><dd>{user?.email ?? notProvided}</dd></div>
      <div><dt>{t('profile.birthday')}</dt><dd>{state.profile.dateOfBirth
        ? <time dateTime={state.profile.dateOfBirth}>{new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(state.profile.dateOfBirth))}</time>
        : notProvided}</dd></div>
      <div><dt>{t('personalProfile.bio')}</dt><dd>{state.profile.bio ?? notProvided}</dd></div>
      </dl>
      <button type="button" className="feed-primary social-profile-edit" onClick={() => { setHasSaved(false); setIsEditing(true) }}>{t('profileEditor.edit')}</button>
    </>}
    {hasSaved && <p role="status" className="social-feedback">{t('profileEditor.success')}</p>}
  </section>
}
