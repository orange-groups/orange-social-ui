import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AppearanceControls } from '../../../components/preferences/AppearanceControls'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { AuthBrand } from './AuthBrand'
import { AuthStory } from './AuthStory'
import { AuthIcon } from './AuthIcon'
import '../auth.css'

const COPYRIGHT_YEAR = new Date().getFullYear()
type AuthLayoutProps = { title: string; description: string; eyebrow?: string; children: ReactNode }

export function AuthLayout({ title, description, eyebrow, children }: AuthLayoutProps) {
  const { t } = useTranslation('common')
  const { t: auth } = useTranslation('auth')
  usePageTitle(t('pageTitle', { title }))
  return (
    <main className="auth-page">
      <a className="auth-skip-link" href="#auth-content">{auth('skipForm')}</a>
      <AuthStory />
      <section className="auth-panel" aria-labelledby="auth-title">
        <header className="auth-panel-header">
          <div className="auth-mobile-brand"><AuthBrand /></div>
          <div className="auth-header-actions"><Link className="auth-back" to="/"><span aria-hidden="true">←</span>{t('backHome')}</Link><AppearanceControls /></div>
        </header>
        <div className="auth-panel-content" id="auth-content" tabIndex={-1}>
          <div className="auth-form-heading"><span className="auth-welcome">{eyebrow ?? auth('welcome')}</span><h1 id="auth-title">{title}<span>.</span></h1><p>{description}</p></div>
          {children}
          <p className="auth-private"><AuthIcon name="lock" />{auth('privacy')}</p>
          <p className="auth-preview-note">{t('previewNotice')}</p>
        </div>
        <footer className="auth-panel-footer"><span>{t('copyright', { year: COPYRIGHT_YEAR })}</span><span>{t('footer')}</span></footer>
      </section>
    </main>
  )
}
