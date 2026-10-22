const paths = {
 home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
 friends: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8m6 10v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 save: 'M5 3h14v18l-7-4-7 4Z', search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
 heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
 comment: 'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H3l1.6-4.5A8.5 8.5 0 1 1 21 11.5Z',
 photo: 'M3 3h18v18H3Zm0 13 5-5 4 4 3-3 6 6M16 7h.01', plus:'M12 5v14M5 12h14',
 arrow:'M5 12h14m-6-6 6 6-6 6', close:'m6 6 12 12M6 18 18 6', leaf:'M20 3C7 2 1 9 6 17s16 2 14-14ZM5 21 16 9', globe:'M21 12H3m9-9c5 5 5 13 0 18-5-5-5-13 0-18m9 9a9 9 0 1 1-18 0 9 9 0 0 1 18 0', logout:'M9 3H3v18h6m0-9h12m-5-5 5 5-5 5', check:'m5 12 4 4L19 6'
}
export type FeedIconName = keyof typeof paths
export function FeedIcon({ name }: { name: FeedIconName }) { return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg> }
