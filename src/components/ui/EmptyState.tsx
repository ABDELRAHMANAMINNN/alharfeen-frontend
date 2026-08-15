import { type ReactNode } from 'react'
import Button from './Button'

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
      <div className="size-16 rounded-full bg-surface flex items-center justify-center text-muted">{icon}</div>
      <h3 className="font-extrabold text-ink text-base">{title}</h3>
      {description && <p className="text-sm text-muted max-w-xs">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export function ErrorState({
  title = 'حدث خطأ ما',
  description = 'تعذّر تحميل البيانات، حاول مرة أخرى.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <EmptyState
      icon={<span className="text-2xl">⚠️</span>}
      title={title}
      description={description}
      actionLabel={onRetry ? 'إعادة المحاولة' : undefined}
      onAction={onRetry}
    />
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-control ${className}`} />
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-border rounded-card p-3 flex gap-3">
      <Skeleton className="size-20 shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-6 w-full mt-2" />
      </div>
    </div>
  )
}
