import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import App from '../App'
import { HomePage } from '../features/feed/pages/HomePage'
import { LoginPage, RegisterPage, ForgotPasswordPage, PreviewPage, NotFoundPage, GuestRoute, ProtectedRoute, useRestoreSession } from '../features/auth'
import { VerifyEmailPage } from '../features/auth/pages/VerifyEmailPage'
import { CheckEmailPage } from '../features/auth/pages/CheckEmailPage'
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage'
import { ProfilePage } from '../features/social/pages/ProfilePage'
import { FriendsPage } from '../features/social/pages/FriendsPage'
import { NotificationsPage } from '../features/social/pages/NotificationsPage'
import { FeedPostsProvider } from '../features/feed/FeedPostsContext'
import { AppShell } from '../components/layout/AppShell'

function RouteEffects() {
  const { pathname, hash } = useLocation()
  const previousPath = useRef(pathname)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
      else {
        window.scrollTo({ top: 0, behavior: 'instant' })
        if (previousPath.current !== pathname) {
          const heading = document.querySelector('h1')
          heading?.setAttribute('tabindex', '-1')
          heading?.focus({ preventScroll: true })
        }
      }
      previousPath.current = pathname
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  return null
}

export function AppRouter() {
  useRestoreSession()
  return (
    <><RouteEffects /><FeedPostsProvider><Routes>
      <Route path="/" element={<App />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/saved" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/check-email" element={<CheckEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/preview" element={<PreviewPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes></FeedPostsProvider></>
  )
}
