import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { createPost } from '../api/posts.api'
import type { PersonalPost } from '../api/posts.api'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const VIDEO_TYPES = ['video/mp4', 'video/webm']
const MIB = 1024 * 1024

export function PersonalPostComposer({ onPublish }: { onPublish: (post: PersonalPost) => void }) {
  const { t } = useTranslation('social')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<{ id: number; file: File }[]>([])
  const [status, setStatus] = useState<'idle' | 'posting' | 'success' | 'invalid' | 'error'>('idle')
  const pending = useRef(false)
  const nextFileId = useRef(0)

  function attach(selection: FileList | null) {
    if (!selection?.length) return
    const selected = Array.from(selection)
    const combined = [...files.map(({ file }) => file), ...selected]
    const images = combined.filter(file => IMAGE_TYPES.includes(file.type))
    const videos = combined.filter(file => VIDEO_TYPES.includes(file.type))
    if (images.length + videos.length !== combined.length || images.length > 4 || videos.length > 1
      || images.some(file => file.size > 5 * MIB) || combined.some(file => !file.size)
      || combined.reduce((bytes, file) => bytes + file.size, 0) > 20 * MIB) {
      setStatus('invalid')
      return
    }
    setFiles([...files, ...selected.map(file => ({ id: nextFileId.current++, file }))])
    setStatus('idle')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current || (!content.trim() && !files.length)) return
    pending.current = true
    setStatus('posting')
    try {
      const post = await createPost(content.trim(), files.map(({ file }) => file))
      onPublish(post)
      setContent('')
      setFiles([])
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      pending.current = false
    }
  }

  return <form className="feed-card feed-composer" onSubmit={event => void submit(event)}>
    <textarea value={content} maxLength={5000} rows={2} disabled={status === 'posting'}
      aria-label={t('ownPosts.content')} placeholder={t('ownPosts.content')}
      onChange={event => setContent(event.target.value)} />
    {files.length > 0 && <ul>{files.map(({ id, file }) => <li key={id}>
      {file.name}{' '}
      <button type="button" aria-label={t('ownPosts.remove', { name: file.name })}
        disabled={status === 'posting'} onClick={() => setFiles(current => current.filter(item => item.id !== id))}>×</button>
    </li>)}</ul>}
    <div className="feed-composer-bottom">
      <label className="feed-photo-button">
        {t('ownPosts.attach')}
        <input type="file" multiple accept={[...IMAGE_TYPES, ...VIDEO_TYPES].join(',')}
          disabled={status === 'posting'} onChange={event => {
            attach(event.currentTarget.files)
            event.currentTarget.value = ''
          }} />
      </label>
      <span>{t('ownPosts.public')}</span>
      <button className="feed-primary" disabled={status === 'posting' || (!content.trim() && !files.length)}>
        {t(status === 'posting' ? 'ownPosts.posting' : 'ownPosts.publish')}
      </button>
    </div>
    {(status === 'invalid' || status === 'error') && <p className="feed-upload-error" role="alert">
      {t(status === 'invalid' ? 'ownPosts.invalid' : 'ownPosts.publishError')}
    </p>}
    {status === 'success' && <p role="status">{t('ownPosts.posted')}</p>}
  </form>
}
