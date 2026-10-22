import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FeedIcon } from './FeedIcon'
import { photoUrl } from '../feed.data'
import type { FeedComment, FeedPost } from '../feed.data'

export function PostCard({ post, update }: { post: FeedPost; update: (post: FeedPost) => void }) {
 const { t } = useTranslation('home')
 const [open, setOpen] = useState(false)
 const [comment, setComment] = useState('')
 const [replyTo, setReplyTo] = useState<FeedComment>()
 const [editing, setEditing] = useState(false)
 const [editText, setEditText] = useState(post.text ?? '')
 const [confirmDelete, setConfirmDelete] = useState(false)
 const privacy = post.privacy ?? 'public'
 function react(next: 'like' | 'love') { update({ ...post, reaction: post.reaction === next ? undefined : next, likes: post.likes + (post.reaction === next ? -1 : post.reaction ? 0 : 1) }) }
 function addComment() { if (!comment.trim()) return; update({ ...post, comments: [...post.comments, { id: Date.now(), text: comment.trim(), parentId: replyTo?.id, depth: replyTo ? replyTo.depth + 1 : 1 }] }); setComment(''); setReplyTo(undefined) }
 return <article className="feed-card feed-post-card">
  <header className="feed-person">{post.own ? <span className="feed-avatar feed-self">Q</span> : <img className="feed-avatar" src={photoUrl(post.avatar)} alt="" />}<div><strong>{post.author}</strong><small>{t(post.own ? 'now' : 'time')} · <FeedIcon name="globe" /> {t(privacy)}</small></div><button className="feed-icon-button feed-save" aria-label={t(post.saved ? 'unsave' : 'save')} aria-pressed={post.saved} onClick={() => update({ ...post, saved: !post.saved })}><FeedIcon name="save" /></button></header>
  {editing ? <form className="feed-edit-form" onSubmit={event => { event.preventDefault(); update({ ...post, text: editText.trim() }); setEditing(false) }}><textarea aria-label={t('editPost')} value={editText} onChange={event => setEditText(event.target.value)} /><div><button type="button" onClick={() => setEditing(false)}>{t('cancel')}</button><button className="feed-primary" disabled={!editText.trim()}>{t('saveChanges')}</button></div></form> : <p className="feed-post-copy">{post.contentKey ? t(post.contentKey) : post.text}</p>}
  {post.image && <img className="feed-post-image" src={post.image} alt={post.imageAlt ? t(post.imageAlt) : ''} loading="lazy" />}
  {post.media && <div className="feed-media-grid">{post.media.map((item, index) => item.kind === 'image' ? <img key={index} src={item.src} alt={t('attachedImage', { count: index + 1 })} /> : <video key={index} src={item.src} controls aria-label={t('attachedVideo')} />)}</div>}
  {post.own && <div className="feed-manage"><label>{t('privacy')}<select aria-label={t('privacy')} value={privacy} onChange={event => update({ ...post, privacy: event.target.value as FeedPost['privacy'] })}><option value="public">{t('public')}</option><option value="friends">{t('friendsOnly')}</option><option value="onlyMe">{t('onlyMe')}</option></select></label><button onClick={() => { setEditText(post.text ?? ''); setEditing(true) }}>{t('editPost')}</button><button onClick={() => setConfirmDelete(true)}>{t('deletePost')}</button></div>}
  {confirmDelete && <div className="feed-delete-confirm"><span>{t('deleteConfirm')}</span><button onClick={() => setConfirmDelete(false)}>{t('cancel')}</button><button onClick={() => update({ ...post, deleted: true })}>{t('deletePost')}</button></div>}
  <div className="feed-post-stats"><span><span className="feed-heart-dot">♥</span> {t('likes', { count: post.likes })}</span><span>{t('comments', { count: post.comments.length })}</span></div>
  <div className="feed-post-actions feed-post-actions-three"><button aria-pressed={post.reaction === 'like'} onClick={() => react('like')}><FeedIcon name="heart" />{t('like')}</button><button aria-pressed={post.reaction === 'love'} onClick={() => react('love')}><FeedIcon name="heart" />{t('love')}</button><button aria-expanded={open} onClick={() => setOpen(!open)}><FeedIcon name="comment" />{t('comment')}</button></div>
  {open && <div className="feed-comments">{post.comments.map(item => <div className="feed-comment-item" style={{ marginLeft: `${(item.depth - 1) * 20}px` }} key={item.id}><strong>{t('you')}</strong><p>{item.text}</p>{item.depth < 3 && <button onClick={() => setReplyTo(item)}>{t('reply')}</button>}</div>)}{replyTo && <div className="feed-reply-to">{t('replyingTo', { name: t('you') })}<button onClick={() => setReplyTo(undefined)}>{t('cancel')}</button></div>}<form onSubmit={event => { event.preventDefault(); addComment() }}><input aria-label={t('commentPlaceholder')} placeholder={t('commentPlaceholder')} value={comment} maxLength={1000} onChange={event => setComment(event.target.value)} /><button className="feed-primary" disabled={!comment.trim()}>{t('send')}</button></form></div>}
 </article>
}
