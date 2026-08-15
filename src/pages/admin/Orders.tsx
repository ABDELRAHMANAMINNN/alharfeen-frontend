import { useEffect, useState, useCallback } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { StatusBadge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/EmptyState'
import { api } from '@/services/api'
import type { ApiOrder } from '@/hooks/useOrdersStore'
import type { OrderStatus } from '@/types'

const statuses: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'PENDING', label: 'قيد الانتظار' },
  { key: 'CONFIRMED', label: 'تم التأكيد' },
  { key: 'PREPARING', label: 'جاري التجهيز' },
  { key: 'SHIPPED', label: 'تم الشحن' },
  { key: 'DELIVERED', label: 'تم التسليم' },
  { key: 'CANCELLED', label: 'ملغي' },
]

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'SHIPPED',
  SHIPPED: 'DELIVERED',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const load = useCallback(() => {
    setLoading(true)
    api.get<ApiOrder[]>('/orders').then(setOrders).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const advance = async (id: string, status: OrderStatus) => {
    await api.patch(`/admin/orders/${id}/status`, { status })
    load()
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div>
      <AdminPageHeader title="الطلبات" subtitle={`${orders.length} طلب إجمالًا`} />

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {statuses.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`shrink-0 text-xs font-bold rounded-full px-3.5 py-1.5 ${filter === s.key ? 'bg-brand text-ink' : 'bg-white border border-border text-ink'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
      ) : (
        <div className="bg-white border border-border rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs border-b border-border">
                <th className="text-right font-bold px-4 py-2">رقم الطلب</th>
                <th className="text-right font-bold px-4 py-2">التاريخ</th>
                <th className="text-right font-bold px-4 py-2">العنوان</th>
                <th className="text-right font-bold px-4 py-2">الإجمالي</th>
                <th className="text-right font-bold px-4 py-2">الحالة</th>
                <th className="text-right font-bold px-4 py-2">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-right font-bold text-ink">#{o.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-right text-muted">{new Date(o.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td className="px-4 py-3 text-right text-muted">{o.address}</td>
                  <td className="px-4 py-3 text-right text-ink">{o.total.toLocaleString('ar-EG')} ج.م</td>
                  <td className="px-4 py-3 text-right"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-right">
                    {nextStatus[o.status] && (
                      <button onClick={() => advance(o.id, nextStatus[o.status]!)} className="text-brand-dark text-xs font-bold">
                        نقل للحالة التالية
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
