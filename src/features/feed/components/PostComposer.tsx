import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FeedIcon } from './FeedIcon'
import type { FeedPost } from '../feed.data'
import { members } from '../feed.data'

type Media = NonNullable<FeedPost['media']>[number]
export function PostComposer({ onPublish }: { onPublish: (post: FeedPost) => void }) {
  const { t } = useTranslation('home')
  const [draft, setDraft] = useState('')
  const [media, setMedia] = useState<Media[]>([])
  const [privacy, setPrivacy] = useState<NonNullable<FeedPost['privacy']>>('public')
  const [error, setError] = useState('')
  const photoInput = useRef<HTMLInputElement>(null)
  const videoInput = useRef<HTMLInputElement>(null)
  function read(file: File): Promise<string> { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(); reader.onerror = reject; reader.readAsDataURL(file) }) }
  async function attach(files: FileList | null, kind: Media['kind']) {
    if (!files?.length) return
    const selected = Array.from(files)
    if (kind === 'image' && (selected.length + media.filter(item => item.kind === 'image').length > 4 || selected.some(file => !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024))) { setError(t('imageLimit')); return }
    if (kind === 'video' && (selected.length > 1 || selected[0].type.startsWith('video/') === false || selected[0].size > 20 * 1024 * 1024 || media.some(item => item.kind === 'video'))) { setError(t('videoLimit')); return }
    try { const next = await Promise.all(selected.map(async file => ({ kind, src: await read(file) }))); setMedia(current => [...current, ...next]); setError('') } catch { setError(t('fileError')) }
  }
  return <form className="feed-card feed-composer" onSubmit={event => { event.preventDefault(); if (!draft.trim() && !media.length) return; onPublish({ id: Date.now(), author: 'Trần Minh Quang', avatar: members[3].image, text: draft.trim(), media, privacy, likes: 0, saved: false, comments: [], own: true }); setDraft(''); setMedia([]); setError(''); if (photoInput.current) photoInput.current.value = ''; if (videoInput.current) videoInput.current.value = '' }}>
    <div className="feed-composer-top"><span className="feed-avatar feed-self">Q</span><textarea value={draft} maxLength={5000} rows={2} aria-label={t('composer')} placeholder={t('composer')} onChange={event => setDraft(event.target.value)} /></div>
    {media.length > 0 && <div className="feed-composer-preview">{media.map((item, index) => <div key={index}>{item.kind === 'image' ? <img src={item.src} alt={t('attachedImage', { count: index + 1 })} /> : <video src={item.src} controls aria-label={t('attachedVideo')} />}<button type="button" aria-label={t('removeMedia')} onClick={() => setMedia(current => current.filter((_, i) => i !== index))}><FeedIcon name="close" /></button></div>)}</div>}
    {error && <p className="feed-upload-error" role="alert">{error}</p>}
    <div className="feed-composer-bottom"><button type="button" className="feed-photo-button" onClick={() => photoInput.current?.click()}><FeedIcon name="photo" />{t('photo')}</button><input className="sr-only" tabIndex={-1} type="file" accept="image/*" multiple ref={photoInput} aria-label={t('photo')} onChange={event => void attach(event.target.files, 'image')} /><button type="button" className="feed-photo-button" onClick={() => videoInput.current?.click()}><FeedIcon name="photo" />{t('video')}</button><input className="sr-only" tabIndex={-1} type="file" accept="video/*" ref={videoInput} aria-label={t('video')} onChange={event => void attach(event.target.files, 'video')} /><select className="feed-privacy-select" aria-label={t('privacy')} value={privacy} onChange={event => setPrivacy(event.target.value as typeof privacy)}><option value="public">{t('public')}</option><option value="friends">{t('friendsOnly')}</option><option value="onlyMe">{t('onlyMe')}</option></select><button className="feed-primary" disabled={!draft.trim() && !media.length}>{t('publish')}<FeedIcon name="arrow" /></button></div>
  </form>
}
