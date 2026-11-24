import type { ReactNode } from 'react'
import '../social.css'

export function SocialLayout({ title, children }: {
  title: string
  children: ReactNode
}) {
  return <>
    <h1 className="sr-only">{title}</h1>
    {children}
  </>
}
