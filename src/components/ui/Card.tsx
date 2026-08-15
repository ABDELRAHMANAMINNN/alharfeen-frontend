import { type HTMLAttributes, type ReactNode } from 'react'
import { Star } from 'lucide-react'

export function Card({ children, className = '', ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`bg-white border border-border rounded-card p-4 ${className}`} {...rest}>
      {children}
    </div>
  )
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-muted">
      <Star className="size-3.5 fill-brand text-brand" />
      <span className="font-bold text-ink">{value.toFixed(1)}</span>
      {count !== undefined && <span>({count})</span>}
    </div>
  )
}
