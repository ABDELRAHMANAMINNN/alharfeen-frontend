import { CheckCircle2, XCircle, Info } from 'lucide-react'
import { useToastStore } from '@/hooks/useToast'

const icons = {
  success: <CheckCircle2 className="size-4 text-success shrink-0" />,
  error: <XCircle className="size-4 text-error shrink-0" />,
  info: <Info className="size-4 text-info shrink-0" />,
}

export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="fixed bottom-20 inset-x-0 z-[60] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2 bg-ink text-body text-sm font-bold rounded-control px-4 py-3 shadow-lg max-w-sm w-full animate-in slide-in-from-bottom-2 fade-in"
        >
          {icons[t.tone]}
          {t.message}
        </div>
      ))}
    </div>
  )
}
