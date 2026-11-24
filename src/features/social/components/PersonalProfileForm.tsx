import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { PersonalProfile, PersonalProfilePatch } from '../api/personal-profile.api'

export function PersonalProfileForm({ profile, onSave, onCancel }: {
  profile: PersonalProfile
  onSave: (changes: PersonalProfilePatch) => Promise<void>
  onCancel: () => void
}) {
  const { t } = useTranslation('social')
  const [fullName, setFullName] = useState(profile.fullName)
  const [bio, setBio] = useState(profile.bio ?? '')
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth ?? '')
  const [latestBirthday] = useState(() => new Date().toISOString().slice(0, 10))
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)

  const changes: PersonalProfilePatch = {}
  if (fullName.trim() !== profile.fullName) changes.fullName = fullName.trim()
  if (bio.trim() !== (profile.bio ?? '')) changes.bio = bio.trim() || null
  if (dateOfBirth !== (profile.dateOfBirth ?? '')) changes.dateOfBirth = dateOfBirth || null
  const canSave = Boolean(fullName.trim()) && Object.keys(changes).length > 0

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSave || isSaving) return
    setHasError(false)
    setIsSaving(true)
    try {
      await onSave(changes)
    } catch {
      setHasError(true)
      setIsSaving(false)
    }
  }

  return <form className="social-form" onSubmit={event => void submit(event)} aria-busy={isSaving}>
    <label>{t('personalProfile.fullName')}<input value={fullName} onChange={event => setFullName(event.target.value)} autoComplete="name" maxLength={150} required disabled={isSaving} /></label>
    <label>{t('personalProfile.bio')}<textarea value={bio} onChange={event => setBio(event.target.value)} maxLength={200} rows={3} disabled={isSaving} /></label>
    <label>{t('profile.birthday')}<input type="date" value={dateOfBirth} onChange={event => setDateOfBirth(event.target.value)} min="0001-01-01" max={latestBirthday} disabled={isSaving} /></label>
    {hasError && <p role="alert" className="social-feedback">{t('profileEditor.error')}</p>}
    <div className="social-actions">
      <button className="feed-primary" disabled={!canSave || isSaving}>{isSaving ? t('profileEditor.saving') : t('profile.save')}</button>
      <button type="button" disabled={isSaving} onClick={onCancel}>{t('profileEditor.cancel')}</button>
    </div>
  </form>
}
