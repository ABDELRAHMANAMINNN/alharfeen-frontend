import { type ReactNode } from 'react'

export default function StatCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string
  value: string
  icon: ReactNode
  trend?: { value: string; positive: boolean }
}) {
  return (
    <div className="bg-white border border-border rounded-card p-4 flex items-center justify-between">
      <div className="bg-brand/10 text-brand-dark p-2.5 rounded-control">{icon}</div>
      <div className="text-right">
        <p className="text-muted text-xs">{label}</p>
        <p className="font-extrabold text-ink text-xl mt-0.5">{value}</p>
        {trend && (
          <p className={`text-xs font-bold mt-0.5 ${trend.positive ? 'text-success' : 'text-error'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </div>
  )
}
