import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { useUserSearch } from '../hooks/useUserSearch'
import { isValidUserQuery, normalizeUserQuery } from '../user-search-query'
import '../user-search.css'

export function UserSearchPage() {
  const { t } = useTranslation('home')
  const [params] = useSearchParams()
  const query = normalizeUserQuery(params.get('q') ?? '')
  usePageTitle(t('peopleSearch.title'))

  return <>
    <h1 className="sr-only">{isValidUserQuery(query)
      ? t('peopleSearch.resultsFor', { query })
      : t('peopleSearch.title')}</h1>
    {isValidUserQuery(query)
      ? <UserSearchResults key={query} query={query} />
      : <p className="feed-card user-search-feedback" role="status">{t('peopleSearch.invalid')}</p>}
  </>
}

function UserSearchResults({ query }: { query: string }) {
  const { t } = useTranslation(['home', 'social'])
  const { state, retry, loadMore, moreStatus } = useUserSearch(query)
  if (state.status === 'loading') return <p className="feed-card user-search-feedback" role="status">{t('peopleSearch.loading')}</p>
  if (state.status !== 'ready') return <div className="feed-card user-search-feedback">
    <p role="alert">{t('peopleSearch.error')}</p>
    <button type="button" className="feed-primary" onClick={retry}>{t('peopleSearch.retry')}</button>
  </div>
  if (state.page.items.length === 0) return <p className="feed-card user-search-feedback" role="status">{t('peopleSearch.empty')}</p>

  return <>
    <ul className="feed-card user-search-results">
      {state.page.items.map(user => <li key={user.id}>
        <Link className="feed-person user-search-result" to={`/profile/${encodeURIComponent(user.id)}`}>
          {user.avatarUrl
            ? <img className="feed-avatar" src={user.avatarUrl} alt="" loading="lazy" />
            : <span className="feed-avatar feed-self" aria-hidden="true">{user.fullName.charAt(0).toUpperCase()}</span>}
          <div><strong>{user.fullName}</strong><small>@{user.username}</small></div>
          {user.relationship.status !== 'self' && user.relationship.status !== 'none' &&
            <span className="user-search-relationship">{t(`publicProfile.relationship.${user.relationship.status}`, { ns: 'social' })}</span>}
        </Link>
      </li>)}
    </ul>
    {moreStatus === 'error' && <p role="alert">{t('peopleSearch.error')}</p>}
    {state.page.nextCursor && <button type="button" className="feed-primary" onClick={() => void loadMore()} disabled={moreStatus === 'loading'}>
      {t(moreStatus === 'loading' ? 'peopleSearch.loading' : moreStatus === 'error' ? 'peopleSearch.retry' : 'peopleSearch.more')}
    </button>}
  </>
}
