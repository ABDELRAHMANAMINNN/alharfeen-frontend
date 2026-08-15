import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 animate-in fade-in" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative bg-white rounded-card w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-white">
          <h2 className="font-extrabold text-ink">{title}</h2>
          <button onClick={onClose} aria-label="إغلاق" className="text-muted hover:text-ink p-1 rounded-full hover:bg-surface">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="p-4 border-t border-border">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = 'bottom',
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'bottom' | 'end'
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const positionClasses =
    side === 'bottom'
      ? 'inset-x-0 bottom-0 rounded-t-[24px] max-h-[85vh]'
      : 'inset-y-0 right-0 h-full w-full max-w-sm'

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label={title} className={`absolute bg-white overflow-y-auto ${positionClasses}`}>
        {side === 'bottom' && <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-extrabold text-ink">{title}</h2>
          <button onClick={onClose} aria-label="إغلاق" className="text-muted hover:text-ink p-1 rounded-full hover:bg-surface">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}
