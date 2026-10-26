import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AppearanceControls } from './components/preferences/AppearanceControls'
import { usePageTitle } from './hooks/usePageTitle'
import type { FormEvent } from 'react'
import { people } from './features/landing/landing.data'
import './App.css'



function Logo() {
  const { t } = useTranslation('landing')
  return (
    <a className="logo" href="#top" aria-label={t('logoLabel')}>
      <span className="logo-mark">{t('logoMark')}</span>
      <span>{t('wordmark')}</span>
    </a>
  )
}

function App() {
  const { t, i18n } = useTranslation('landing')
  const { t: common } = useTranslation('common')
  usePageTitle(common('homeTitle'))
  useEffect(() => {
    document.querySelector('meta[name="description"]')?.setAttribute('content', common('homeDescription'))
  }, [common])
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [liked, setLiked] = useState(false)

  const joinWaitlist = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email.trim()) setJoined(true)
  }

  return (
    <main id="top">
      <nav className="nav shell" aria-label={t('navLabel')}>
        <Logo />
        <button
          className="menu-button"
          type="button"
          aria-label={t(menuOpen ? 'menuClose' : 'menuOpen')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
        <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
          <Link to="/login" onClick={() => setMenuOpen(false)}>{t('login')}</Link>
          <Link to="/register" onClick={() => setMenuOpen(false)}>{t('register')}</Link>
          <a href="#inside" onClick={() => setMenuOpen(false)}>{t('inside')}</a>
          <a href="#values" onClick={() => setMenuOpen(false)}>{t('values')}</a>
          <a href="#community" onClick={() => setMenuOpen(false)}>{t('community')}</a>
          <Link className="button button-small button-dark" to="/register" onClick={() => setMenuOpen(false)}>{t('register')}</Link>
        </div>
        <AppearanceControls />
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><span />{t('eyebrow')}</div>
          <h1>{t('heroTitle')} <em>{t('heroAccent')}</em></h1>
          <p className="hero-description">{t('heroDescription')} </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#join">{t('reserve')} <span aria-hidden="true">→</span></a>
            <a className="text-link" href="#inside">{t('explore')} <span aria-hidden="true">↓</span></a>
          </div>
          <div className="people-row">
            <div className="avatar-stack">
              {people.map((person) => <img key={person.name} src={person.avatar} alt={t('memberAlt', { name: person.name })} />)}
            </div>
            <p><strong>{t('peopleCount')}</strong><br />{t('peopleNote')}</p>
          </div>
        </div>

        <div className="hero-visual" aria-label={t('feedPreview')}>
          <div className="sun-disc" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="phone">
            <div className="phone-top">
              <span className="mini-logo">{t('logoMark')}</span>
              <span className="feed-title">{t('forYou')}</span>
              <span className="profile-dot" />
            </div>
            <article className="feed-post">
              <div className="post-author">
                <img src={people[0].avatar} alt={t('postAuthor')} />
                <div><strong>{t('postAuthor')}</strong><span>{t('postTime')}</span></div>
                <button type="button" aria-label={t('more')}>•••</button>
              </div>
              <p>{t('postCopy')}</p>
              <img className="post-image" src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=85" alt={t('postAlt')} />
              <div className="post-actions">
                <button className={liked ? 'liked' : ''} type="button" onClick={() => setLiked((value) => !value)}>
                  {t(liked ? 'liked' : 'like')} · {new Intl.NumberFormat(i18n.resolvedLanguage, { notation: 'compact' }).format(liked ? 2500 : 2400)}
                </button>
                <button type="button">{t('comments')}</button>
              </div>
            </article>
            <div className="home-indicator" />
          </div>
          <div className="floating-note note-top"><strong>{t('noAds')}</strong><span>{t('onlyYou')}</span></div>
          <div className="floating-note note-bottom"><span className="pulse" /><strong>{t('conversations')}</strong></div>
        </div>
      </section>

      <section className="ticker" aria-label={t('tickerLabel')}>
        <div>
          <span>{t('scrollLess')}</span><b>✳</b><span>{t('liveMore')}</span><b>✳</b><span>{t('connectMore')}</span><b>✳</b><span>{t('scrollLess')}</span><b>✳</b><span>{t('liveMore')}</span>
        </div>
      </section>

      <section className="inside shell section" id="inside">
        <div className="section-heading">
          <span className="section-number">{t('sectionOne')}</span>
          <div>
            <p className="kicker">{t('inside')}</p>
            <h2>{t('insideTitle')}<br />{t('insideConnector')} <em>{t('insideAccent')}</em></h2>
          </div>
        </div>
        <div className="feature-layout">
          <div className="feature-image-wrap">
            <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=85" alt={t('friendsAlt')} />
            <span>{t('madeFor')}<br />{t('realLife')}</span>
          </div>
          <div className="feature-list">
            <article>
              <span>{t('sectionOne')}</span>
              <div><h3>{t('featureFeedTitle')}</h3><p>{t('featureFeedDescription')}</p></div>
            </article>
            <article>
              <span>{t('sectionTwo')}</span>
              <div><h3>{t('featureGroupsTitle')}</h3><p>{t('featureGroupsDescription')}</p></div>
            </article>
            <article>
              <span>{t('sectionThree')}</span>
              <div><h3>{t('featureAttentionTitle')}</h3><p>{t('featureAttentionDescription')}</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="values section" id="values">
        <div className="shell values-grid">
          <div className="values-copy">
            <p className="kicker">{t('beliefEyebrow')}</p>
            <h2>{t('beliefTitle')} <em>{t('beliefAccent')}</em>{' '}{t('beliefEnd')}</h2>
            <p>{t('beliefDescription')}</p>
          </div>
          <div className="quote-card">
            <div className="quote-mark">“</div>
            <blockquote>{t('quote')}</blockquote>
            <div className="quote-person">
              <img src={people[2].avatar} alt={t('quoteAuthor')} />
              <div><strong>{t('quoteAuthor')}</strong><span>{t('quoteRole')}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="community shell section" id="community">
        <div className="community-copy">
          <span className="section-number">{t('sectionTwo')}</span>
          <p className="kicker">{t('communityEyebrow')}</p>
          <h2>{t('communityTitle')}<br />{t('communityEnd')}</h2>
          <p>{t('communityDescription')}</p>
          <a className="text-link" href="#join">{t('communityJoin')} <span aria-hidden="true">→</span></a>
        </div>
        <div className="portrait-grid">
          <img className="portrait-tall" src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=85" alt={t('outdoorAlt')} />
          <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=85" alt={t('portraitAlt')} />
          <div className="stat-tile"><strong>{t('cityCount')}</strong><span>{t('cityLabel')}<br />{t('cityNote')}</span></div>
        </div>
      </section>

      <section className="join" id="join">
        <div className="join-shape shape-left" />
        <div className="join-shape shape-right" />
        <div className="join-content">
          <p className="kicker">{t('joinEyebrow')}</p>
          <h2>{t('joinTitle')}<br /><em>{t('joinAccent')}</em></h2>
          <p>{t('joinDescription')}</p>
          {joined ? (
            <div className="success-message" role="status">{t('joinPreview')}</div>
          ) : (
            <form onSubmit={joinWaitlist}>
              <label className="sr-only" htmlFor="email">{t('emailLabel')}</label>
              <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required placeholder={t('emailPlaceholder')} value={email} onChange={(event) => setEmail(event.target.value)} />
              <button type="submit">
                {t('joinSubmit')} <span aria-hidden="true">→</span>
              </button>
            </form>
          )}
          <small>{t('joinNote')}</small>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-main">
          <div><Logo /><p>{t('footerDescription')}</p></div>
          <div className="footer-links">
            <div><span>{t('brand')}</span><a href="#inside">{t('about')}</a><a href="#community">{t('community')}</a><a href="#join">{t('waitlist')}</a></div>
            <div><span>{t('follow')}</span><a href="#top">{t('instagram')}</a><a href="#top">{t('tiktok')}</a><a href="#top">{t('threads')}</a></div>
            <div><span>{t('information')}</span><a href="#top">{t('privacy')}</a><a href="#top">{t('terms')}</a><a href="mailto:hello@orange.social">{t('contact')}</a></div>
          </div>
        </div>
        <div className="shell footer-bottom"><span>{t('copyright')}</span><span>{t('madeIn')}</span></div>
      </footer>
    </main>
  )
}

export default App
