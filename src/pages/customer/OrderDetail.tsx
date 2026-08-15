import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Check, Package } from 'lucide-react'
import { useOrdersStore, type ApiOrder } from '@/hooks/useOrdersStore'
import { StatusBadge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/EmptyState'
import type { OrderStatus } from '@/types'
import Placeholder from '@/pages/Placeholder'

const timeline: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED']
const timelineLabels: Record<OrderStatus, string> = {
  PENDING: 'قيد الانتظار',
  CONFIRMED: 'تم التأكيد',
  PREPARING: 'جاري التجهيز',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التسليم',
  CANCELLED: 'ملغي',
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const getOrder = useOrdersStore((s) => s.getOrder)
  const [order, setOrder] = useState<ApiOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getOrder(id)
      .then(setOrder)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id, getOrder])

  if (loading) return <div className="p-4 flex flex-col gap-3"><Skeleton className="h-32" /><Skeleton className="h-40" /></div>
  if (notFound || !order) return <Placeholder title="الطلب غير موجود" />

  const currentIndex = timeline.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <div className="px-4 pt-4 pb-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <StatusBadge status={order.status} />
        <div className="text-right">
          <h1 className="font-extrabold text-ink text-lg">#{order.id.slice(0, 8)}</h1>
          <p className="text-muted text-xs">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
        </div>
      </div>

      {!isCancelled && (
        <div className="bg-white border border-border rounded-card p-4 flex flex-col gap-3">
          {timeline.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`size-6 rounded-full flex items-center justify-center shrink-0 ${i <= currentIndex ? 'bg-brand text-ink' : 'bg-border text-muted'}`}>
                {i <= currentIndex && <Check className="size-3.5" />}
              </div>
              <span className={`text-sm ${i <= currentIndex ? 'font-bold text-ink' : 'text-muted'}`}>{timelineLabels[step]}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-border rounded-card p-4 flex flex-col gap-3">
        <p className="font-bold text-ink text-sm text-right">المنتجات</p>
        {order.items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3">
            <span className="font-bold text-ink text-sm">{(item.price * item.quantity).toLocaleString('ar-EG')} ج.م</span>
            <div className="flex-1 text-right">
              <p className="text-sm text-ink">{item.name}</p>
              <p className="text-muted text-xs">الكمية: {item.quantity}</p>
            </div>
            <div className="size-12 rounded-control bg-surface flex items-center justify-center text-muted">
              <Package className="size-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-card p-4 flex flex-col gap-2 text-sm text-right">
        <p><span className="text-muted">العنوان: </span><span className="font-bold text-ink">{order.address}</span></p>
        <p><span className="text-muted">الدفع: </span><span className="font-bold text-ink">{order.paymentMethod}</span></p>
        <p className="border-t border-border pt-2"><span className="text-muted">الإجمالي: </span><span className="font-extrabold text-ink">{order.total.toLocaleString('ar-EG')} ج.م</span></p>
      </div>
    </div>
  )
}
