import { createContext } from 'react'
import type { FeedPost } from './feed.data'

type FeedPostsValue = { posts: FeedPost[]; publish: (post: FeedPost) => void; update: (post: FeedPost) => void }
export const FeedPostsContext = createContext<FeedPostsValue | null>(null)
