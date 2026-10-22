import { useState } from 'react'
import type { ReactNode } from 'react'
import { initialPosts } from './feed.data'
import { FeedPostsContext } from './feedPosts.context'

export function FeedPostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState(initialPosts)
  return <FeedPostsContext.Provider value={{ posts, publish: post => setPosts(current => [post, ...current]), update: post => setPosts(current => current.map(item => item.id === post.id ? post : item)) }}>{children}</FeedPostsContext.Provider>
}
