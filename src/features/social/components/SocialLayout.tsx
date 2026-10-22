import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import '../social.css'

export function SocialLayout({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const { t } = useTranslation('social')
  return <><div className="feed-heading"><p>{t('eyebrow')}</p><h1>{title}</h1><span>{description}</span></div>{children}</>
}
