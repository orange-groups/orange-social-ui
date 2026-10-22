export const members = [
 { name: 'Linh Trang', image: 'photo-1494790108377-be9c29b29330' },
 { name: 'Minh Hoàng', image: 'photo-1500648767791-00dcc994a43e' },
 { name: 'Hà Bảo Ngọc', image: 'photo-1534528741775-53994a69daeb' },
 { name: 'Lê Hoàng Nam', image: 'photo-1507003211169-0a1dd7228f2d' },
]
export const photoUrl = (image: string, width = 120) => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=80`
export const scenery = 'photo-1472396961693-142e6e269027'
export const workspace = 'photo-1497215728101-856f4ea42174'
export type FeedComment = { id: number; text: string; parentId?: number; depth: number }
export type FeedPost = { id: number; author: string; avatar: string; text?: string; contentKey?: 'post1' | 'post2'; image?: string; imageAlt?: 'landscape' | 'desk'; media?: { kind: 'image' | 'video'; src: string }[]; privacy?: 'public' | 'friends' | 'onlyMe'; deleted?: boolean; likes: number; reaction?: 'like' | 'love'; saved: boolean; comments: FeedComment[]; own?: boolean }
export const initialPosts: FeedPost[] = [
 { id: 1, author: 'Linh Trang', avatar: members[0].image, contentKey: 'post1', image: photoUrl(scenery, 1200), imageAlt: 'landscape', likes: 128, saved: false, comments: [] },
 { id: 2, author: 'Lê Hoàng Nam', avatar: members[3].image, contentKey: 'post2', image: photoUrl(workspace, 1200), imageAlt: 'desk', likes: 86, saved: false, comments: [] },
]
