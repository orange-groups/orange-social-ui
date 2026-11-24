import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FeedIcon } from '../../feed/components/FeedIcon'
import { isValidUserQuery, normalizeUserQuery } from '../user-search-query'
import '../user-search.css'

export function UserSearchBar({ initialQuery }: { initialQuery: string }) {
  const { t } = useTranslation('home')
  const navigate = useNavigate()
  const errorId = useId()
  const [value, setValue] = useState(initialQuery)
  const [isInvalid, setIsInvalid] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = normalizeUserQuery(value)
    if (!isValidUserQuery(query)) {
      setIsInvalid(true)
      return
    }
    setIsInvalid(false)
    navigate(`/search?${new URLSearchParams({ q: query })}`)
  }

  return <form className="feed-search user-search-form" role="search" onSubmit={submit}>
    <button type="submit" aria-label={t('peopleSearch.submit')}><FeedIcon name="search" /></button>
    <input type="search" placeholder={t('peopleSearch.input')} aria-label={t('peopleSearch.input')}
      aria-invalid={isInvalid} aria-describedby={isInvalid ? errorId : undefined} value={value}
      onChange={event => { setValue(event.target.value); setIsInvalid(false) }} />
    {isInvalid && <p className="user-search-error" id={errorId} role="alert">{t('peopleSearch.invalid')}</p>}
  </form>
}
