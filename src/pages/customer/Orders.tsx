import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardList, ChevronLeft } from 'lucide-react'
import { useOrdersStore } from '@/hooks/useOrdersStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { StatusBadge } from '@/components/ui/Badge'
import { EmptyState, Skeleton } from '@/components/ui/EmptyState'
import type { OrderStatus } from '@/types'

const tabs: { key: 'all' | 'active' | 'completed' | 'cancelled'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'active', label: 'نشطة' },
  { key: 'completed', label: 'مكتملة' },
  { key: 'cancelled', label: 'ملغاة' },
]

const activeStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED']

export default function Orders() {
  const { orders, loading, fetch } = useOrdersStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('all')

  useEffect(() => {
    if (user) fetch()
  }, [user, fetch])

  if (!user) {
    return (
      <div className="px-4 pt-4">
        <EmptyState icon={<ClipboardList className="size-7" />} title="سجّل الدخول لعرض طلباتك" actionLabel="تسجيل الدخول" onAction={() => navigate('/login')} />
      </div>
    )
  }

  const filtered = orders.filter((o) => {
    if (tab === 'active') return activeStatuses.includes(o.status)
    if (tab === 'completed') return o.status === 'DELIVERED'
    if (tab === 'cancelled') return o.status === 'CANCELLED'
    return true
  })

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
      <h1 className="font-extrabold text-ink text-lg text-right">طلباتي</h1>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 text-xs font-bold rounded-full px-3.5 py-1.5 ${tab === t.key ? 'bg-brand text-ink' : 'bg-white border border-border text-ink'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2.5"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<ClipboardList className="size-7" />} title="مفيش طلبات هنا" />
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((o) => (
            <Link key={o.id} to={`/orders/${o.id}`} className="bg-white border border-border rounded-card p-4 flex items-center justify-between">
              <ChevronLeft className="size-4 text-muted rotate-180" />
              <div className="flex-1 text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-bold text-ink text-sm">#{o.id.slice(0, 8)}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-muted text-xs mt-1">{new Date(o.createdAt).toLocaleDateString('ar-EG')} · {o.total.toLocaleString('ar-EG')} ج.م</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
