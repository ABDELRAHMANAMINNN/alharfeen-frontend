import { useEffect, useState } from 'react'
import { Bell, Truck, Tag, TrendingDown, Info } from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import { EmptyState, Skeleton } from '@/components/ui/EmptyState'

type NotificationItem = { id: string; type: string; title: string; body: string; read: boolean; createdAt: string }

const icons: Record<string, typeof Bell> = { order: Truck, promo: Tag, price: TrendingDown, system: Info }

export default function Notifications() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    api.get<NotificationItem[]>('/notifications').then(setItems).finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="px-4 pt-4">
        <EmptyState icon={<Bell className="size-7" />} title="سجّل الدخول لعرض إشعاراتك" actionLabel="تسجيل الدخول" onAction={() => navigate('/login')} />
      </div>
    )
  }

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
      <h1 className="font-extrabold text-ink text-lg text-right">الإشعارات</h1>

      {loading ? (
        <div className="flex flex-col gap-2"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
      ) : items.length === 0 ? (
        <EmptyState icon={<Bell className="size-7" />} title="مفيش إشعارات جديدة" />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((n) => {
            const Icon = icons[n.type] ?? Info
            return (
              <div key={n.id} className={`flex gap-3 p-3.5 rounded-card border ${n.read ? 'bg-white border-border' : 'bg-brand/5 border-brand/30'}`}>
                <div className="flex-1 text-right">
                  <p className="font-bold text-ink text-sm">{n.title}</p>
                  <p className="text-muted text-xs mt-0.5">{n.body}</p>
                  <p className="text-muted text-[11px] mt-1">{new Date(n.createdAt).toLocaleDateString('ar-EG')}</p>
                </div>
                <div className="bg-surface p-2 rounded-control h-fit text-ink">
                  <Icon className="size-4" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
