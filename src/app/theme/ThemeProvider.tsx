import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { readPreference, THEME_KEY, writePreference } from '../preferences'
import { ThemeContext } from './ThemeContext'
import type { Theme } from './ThemeContext'

function initialTheme(): Theme {
  const stored = readPreference(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim())
  }, [theme])
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const followSystem = () => { if (!readPreference(THEME_KEY)) setTheme(media.matches ? 'dark' : 'light') }
    media.addEventListener('change', followSystem)
    return () => media.removeEventListener('change', followSystem)
  }, [])
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    writePreference(THEME_KEY, next)
    setTheme(next)
  }
  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>
}
