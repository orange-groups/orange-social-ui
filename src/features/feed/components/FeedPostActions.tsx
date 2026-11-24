import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FeedPost } from '../feed.data'
import { FeedIcon } from './FeedIcon'

type Reaction = NonNullable<FeedPost['reaction']>

export function FeedPostActions({ post, onReact, commentsId, isCommentsOpen, onToggleComments }: {
  post: FeedPost
  onReact: (reaction: Reaction) => void
  commentsId: string
  isCommentsOpen: boolean
  onToggleComments: () => void
}) {
  const { t } = useTranslation('home')
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'manual'>('idle')
  const reactionPickerId = useId()
  const reactionButton = useRef<HTMLButtonElement>(null)
  const canShare = (post.privacy ?? 'public') === 'public' && Boolean(post.contentKey || post.text?.trim())
  const shareContent = post.contentKey
    ? new URL(`/home#feed-post-${post.id}`, window.location.origin).href
    : post.text ?? ''

  function closeReactionPicker() {
    setIsReactionPickerOpen(false)
    reactionButton.current?.focus()
  }

  async function share() {
    setShareStatus('idle')
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(post.contentKey ? { url: shareContent } : { text: shareContent })
        return
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(shareContent)
      setShareStatus('copied')
    } catch {
      setShareStatus('manual')
    }
  }

  return <>
    <div className="feed-post-actions">
      <div className="feed-reaction-picker"
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsReactionPickerOpen(false)
        }}
        onKeyDown={event => {
          if (event.key === 'Escape' && isReactionPickerOpen) {
            event.stopPropagation()
            closeReactionPicker()
          }
        }}>
        <button type="button" ref={reactionButton} aria-expanded={isReactionPickerOpen} aria-controls={reactionPickerId}
          aria-label={post.reaction ? t('currentReaction', { reaction: t(post.reaction) }) : undefined}
          data-reacted={Boolean(post.reaction)} onClick={() => setIsReactionPickerOpen(current => !current)}>
          <FeedIcon name="heart" />{t('react')}
        </button>
        <div id={reactionPickerId} className="feed-reaction-options" role="group" aria-label={t('react')} hidden={!isReactionPickerOpen}>
          {(['like', 'love'] as const).map(reaction => <button key={reaction} type="button" aria-pressed={post.reaction === reaction}
            onClick={() => { onReact(reaction); closeReactionPicker() }}>{t(reaction)}</button>)}
        </div>
      </div>
      <button type="button" aria-expanded={isCommentsOpen} aria-controls={commentsId} onClick={onToggleComments}>
        <FeedIcon name="comment" />{t('comment')}
      </button>
      <button type="button" disabled={!canShare} onClick={() => void share()}>
        <FeedIcon name="share" />{t('share')}
      </button>
    </div>
    {canShare && shareStatus === 'copied' && <p className="feed-share-feedback" role="status">{t('shareCopied')}</p>}
    {canShare && shareStatus === 'manual' && <label className="feed-share-feedback">
      {t('shareManual')}<input readOnly value={shareContent} onFocus={event => event.currentTarget.select()} />
    </label>}
  </>
}
