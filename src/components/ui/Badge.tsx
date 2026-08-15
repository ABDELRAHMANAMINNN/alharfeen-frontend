import { ShieldCheck } from 'lucide-react'
import { type ReactNode } from 'react'
import type { OrderStatus } from '@/types'

type Tone = 'brand' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand/10 text-brand-dark',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-brand-dark',
  error: 'bg-error/10 text-error',
  info: 'bg-info/10 text-info',
  neutral: 'bg-slate-100 text-muted',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-xs font-bold ${toneClasses[tone]}`}>
      {children}
    </span>
  )
}

export function VerificationBadge({ label = 'بائع موثّق' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      {label}
      <ShieldCheck className="size-3.5 text-success" strokeWidth={2.5} />
    </span>
  )
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; tone: Tone }> = {
    PENDING: { label: 'قيد الانتظار', tone: 'warning' },
    CONFIRMED: { label: 'تم التأكيد', tone: 'info' },
    PREPARING: { label: 'جاري التجهيز', tone: 'brand' },
    SHIPPED: { label: 'تم الشحن', tone: 'info' },
    DELIVERED: { label: 'تم التسليم', tone: 'success' },
    CANCELLED: { label: 'ملغي', tone: 'error' },
  }
  const { label, tone } = map[status]
  return <Badge tone={tone}>{label}</Badge>
}
