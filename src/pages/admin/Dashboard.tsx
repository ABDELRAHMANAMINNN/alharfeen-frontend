import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, ClipboardList, Store, Package, AlertTriangle, ShieldAlert, ChevronLeft } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import StatCard from '@/components/admin/StatCard'
import { StatusBadge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/EmptyState'
import { api } from '@/services/api'
import type { ApiOrder } from '@/hooks/useOrdersStore'

type DashboardStats = {
  revenue: number
  orderCount: number
  pendingOrders: number
  sellerCount: number
  pendingSellers: number
  productCount: number
  lowStock: number
  outOfStock: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get<DashboardStats>('/admin/dashboard'), api.get<ApiOrder[]>('/orders')])
      .then(([s, orders]) => {
        setStats(s)
        setRecentOrders(orders.slice(0, 5))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader title="لوحة التحكم" subtitle="نظرة عامة على أداء المنصة" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="الإيرادات" value={`${stats.revenue.toLocaleString('ar-EG')} ج.م`} icon={<DollarSign className="size-5" />} />
        <StatCard label="الطلبات" value={String(stats.orderCount)} icon={<ClipboardList className="size-5" />} />
        <StatCard label="البائعون" value={String(stats.sellerCount)} icon={<Store className="size-5" />} />
        <StatCard label="المنتجات" value={String(stats.productCount)} icon={<Package className="size-5" />} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link to="/admin/inventory" className="bg-white border border-border rounded-card p-4 flex items-center justify-between hover:border-brand">
          <ChevronLeft className="size-4 text-muted rotate-180" />
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="font-bold text-ink text-sm">{stats.lowStock} منتج بمخزون منخفض</p>
              <p className="text-muted text-xs">{stats.outOfStock} نفذ من المخزون تمامًا</p>
            </div>
            <div className="bg-warning/10 text-warning p-2.5 rounded-control"><AlertTriangle className="size-5" /></div>
          </div>
        </Link>
        <Link to="/admin/sellers" className="bg-white border border-border rounded-card p-4 flex items-center justify-between hover:border-brand">
          <ChevronLeft className="size-4 text-muted rotate-180" />
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="font-bold text-ink text-sm">{stats.pendingSellers} بائع بانتظار التوثيق</p>
              <p className="text-muted text-xs">يحتاج مراجعة المستندات</p>
            </div>
            <div className="bg-info/10 text-info p-2.5 rounded-control"><ShieldAlert className="size-5" /></div>
          </div>
        </Link>
      </div>

      <div className="bg-white border border-border rounded-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <Link to="/admin/orders" className="text-brand-dark text-xs font-bold">عرض الكل</Link>
          <p className="font-extrabold text-ink text-sm">آخر الطلبات {stats.pendingOrders > 0 && `(${stats.pendingOrders} بانتظار المعالجة)`}</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted text-xs border-b border-border">
              <th className="text-right font-bold px-4 py-2">رقم الطلب</th>
              <th className="text-right font-bold px-4 py-2">التاريخ</th>
              <th className="text-right font-bold px-4 py-2">الإجمالي</th>
              <th className="text-right font-bold px-4 py-2">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-right font-bold text-ink">#{o.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-right text-muted">{new Date(o.createdAt).toLocaleDateString('ar-EG')}</td>
                <td className="px-4 py-3 text-right text-ink">{o.total.toLocaleString('ar-EG')} ج.م</td>
                <td className="px-4 py-3 text-right"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
