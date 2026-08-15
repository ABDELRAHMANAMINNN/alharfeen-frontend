import { type ReactNode } from 'react'

export default function AdminPageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">{action}</div>
      <div className="text-right">
        <h1 className="font-extrabold text-ink text-xl">{title}</h1>
        {subtitle && <p className="text-muted text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}
