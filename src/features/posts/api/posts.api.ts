import { apiRequest } from '../../../lib/api-client'

export type PersonalPost = {
  id: string
  author: { fullName: string; avatarUrl: string | null }
  content: string | null
  media: { id: string; type: 'image' | 'video'; url: string }[]
  privacy: 'public' | 'friends' | 'only_me'
  createdAt: string
}

type PostsPage = { items: PersonalPost[]; nextCursor: string | null }

export function getProfilePosts(signal: AbortSignal, cursor?: string, authorId?: string) {
  const query = new URLSearchParams()
  if (authorId) query.set('authorId', authorId)
  if (cursor) query.set('cursor', cursor)
  const path = authorId ? '/posts' : '/posts/me'
  return apiRequest<PostsPage>(query.size ? `${path}?${query}` : path, { signal })
}

export function createPost(content: string, files: File[]) {
  const body = new FormData()
  if (content) body.append('content', content)
  for (const file of files) body.append('files', file)
  return apiRequest<PersonalPost>('/posts', { method: 'POST', body })
}
