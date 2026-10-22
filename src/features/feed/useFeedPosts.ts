import { useContext } from 'react'
import { FeedPostsContext } from './feedPosts.context'

export function useFeedPosts() {
  const value = useContext(FeedPostsContext)
  if (!value) throw new Error('FeedPostsProvider is missing')
  return value
}
