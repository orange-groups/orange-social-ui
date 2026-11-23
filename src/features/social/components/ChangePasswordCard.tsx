import { useTranslation } from 'react-i18next'
import { useChangePassword } from '../../auth'

export function ChangePasswordCard() {
  const { t } = useTranslation('social')
  const { t: auth } = useTranslation('auth')
  const { error, isSaving, submit } = useChangePassword()

  return <section className="social-card">
    <h2>{t('profile.password')}</h2>
    <form className="social-form" method="post" onSubmit={event => void submit(event)} aria-busy={isSaving}>
      <label>{auth('changePassword.current')}<input name="currentPassword" type="password" autoComplete="current-password" required disabled={isSaving} /></label>
      <label>{t('profile.newPassword')}<input name="newPassword" type="password" autoComplete="new-password" aria-describedby="change-password-hint" required disabled={isSaving} /></label>
      <label>{auth('changePassword.confirm')}<input name="confirmPassword" type="password" autoComplete="new-password" required disabled={isSaving} /></label>
      <p id="change-password-hint" className="feed-muted">{auth('errors.passwordPolicy')} {auth('changePassword.sessionNotice')}</p>
      {error && <p role="alert" className="social-feedback">{error === 'passwordRule' ? auth('errors.passwordPolicy') : auth(`changePassword.${error}`)}</p>}
      <button className="feed-primary" disabled={isSaving}>{isSaving ? auth('changePassword.saving') : t('profile.changePassword')}</button>
    </form>
  </section>
}
