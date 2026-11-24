import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function ProfileShareLink({ userId }: { userId: string }) {
  const { t } = useTranslation('social')
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual'>('idle')
  const url = new URL(`/profile/${encodeURIComponent(userId)}`, window.location.origin).href

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setStatus('copied')
    } catch {
      setStatus('manual')
    }
  }

  return <>
    <button type="button" className="feed-primary" onClick={() => void copyLink()}>{t('publicProfile.copyLink')}</button>
    {status === 'copied' && <p className="social-feedback" role="status">{t('publicProfile.copied')}</p>}
    {status === 'manual' && <label className="social-share-link">
      {t('publicProfile.manualCopy')}
      <input type="url" readOnly value={url} onFocus={event => event.currentTarget.select()} />
    </label>}
  </>
}
