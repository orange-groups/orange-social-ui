import { useTranslation } from 'react-i18next'
import { AuthBrand } from './AuthBrand'
import { AuthIcon } from './AuthIcon'

export function AuthStory() {
  const { t } = useTranslation('auth')
  return (
    <aside className="auth-story" aria-label={t('story.label')}>
      <AuthBrand />
      <div className="auth-story-copy">
        <p className="auth-eyebrow"><span />{t('story.eyebrow')}</p>
        <h2>{t('story.title')}<br /><span>{t('story.titleAccent')}</span></h2>
        <p>{t('story.description')}<br className="auth-desktop-break" />{' '}{t('story.descriptionEnd')}</p>
      </div>
      <div className="auth-collage" aria-hidden="true">
        <div className="auth-orbit auth-orbit-one" /><div className="auth-orbit auth-orbit-two" />
        <div className="auth-sticker"><AuthIcon name="heart" /><span>{t('story.sticker')}<br /><strong>{t('story.stickerStrong')}</strong></span></div>
        <div className="auth-post">
          <div className="auth-post-heading"><span className="auth-avatar">{t('story.avatar')}</span><div><strong>{t('story.author')}</strong><small>{t('story.time')}</small></div><span className="auth-post-menu">•••</span></div>
          <svg className="auth-landscape" viewBox="0 0 360 208" fill="none">
            <rect width="360" height="208" fill="var(--color-illustration-sky)" /><circle cx="267" cy="59" r="29" fill="var(--color-illustration-sun)" />
            <path d="M0 141 84 61l103 118 64-89 109 91v27H0Z" fill="var(--color-illustration-mountain)" />
            <path d="m0 177 101-70 113 101H0Z" fill="var(--color-illustration-foreground)" /><path d="m122 208 112-70 126 51v19Z" fill="var(--color-illustration-hill)" />
            <path d="M240 208c-53-44-95-18-140-48 13 36 77 26 93 48" fill="var(--color-illustration-path)" />
            <path d="m38 132 10-30 10 30H38Zm-9 15 19-39 19 39H29Z" fill="var(--color-illustration-tree)" />
          </svg>
          <p>{t('story.post')}</p>
          <div className="auth-post-footer"><span><AuthIcon name="heart" />{t('story.reaction')}</span><AuthIcon name="message" /></div>
        </div>
        <div className="auth-chat"><span className="auth-avatar auth-avatar-green">{t('story.chatAvatar')}</span><div><strong>{t('story.chat')}</strong><span>{t('story.chatNote')}</span></div><span className="auth-chat-dot" /></div>
        <span className="auth-spark auth-spark-one">✳</span><span className="auth-spark auth-spark-two">✳</span>
      </div>
      <p className="auth-story-footer"><span />{t('story.footer')}</p>
    </aside>
  )
}
