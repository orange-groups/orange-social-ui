import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import '@fontsource/be-vietnam-pro/400-italic.css'
import '@fontsource/be-vietnam-pro/600-italic.css'
import '@fontsource/be-vietnam-pro/700-italic.css'
import './i18n'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './app/theme/ThemeProvider'
import { AppRouter } from './app/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider><BrowserRouter><AppRouter /></BrowserRouter></ThemeProvider>
  </StrictMode>,
)
