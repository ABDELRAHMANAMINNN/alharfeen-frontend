import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import StatCard from '@/components/admin/StatCard'
import { Skeleton } from '@/components/ui/EmptyState'
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import { api } from '@/services/api'
import { useCategories } from '@/services/catalog'
import type { ApiOrder } from '@/hooks/useOrdersStore'
import type { ApiProduct } from '@/services/catalog'

const COLORS = ['#f59e0b', '#0b0f19', '#0ea5e9', '#16a34a', '#ef4444', '#64748b']

export default function Analytics() {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { data: categories } = useCategories()

  useEffect(() => {
    Promise.all([
      api.get<ApiOrder[]>('/orders'),
      api.get<{ items: ApiProduct[] }>('/admin/products?pageSize=200'),
    ])
      .then(([o, p]) => {
        setOrders(o)
        setProducts(p.items)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
  }

  const revenue = orders.filter((o) => o.status !== 'CANCELLED').reduce((s, o) => s + o.total, 0)
  const aov = orders.length ? Math.round(revenue / orders.length) : 0

  const salesByCategory = (categories ?? [])
    .map((c) => ({ name: c.name, value: products.filter((p) => p.categoryId === c.id).length }))
    .filter((c) => c.value > 0)

  // Revenue grouped by order date (real data, computed client-side from actual orders)
  const revenueByDay = orders.reduce<Record<string, number>>((acc, o) => {
    const day = new Date(o.createdAt).toLocaleDateString('ar-EG', { weekday: 'short' })
    acc[day] = (acc[day] ?? 0) + o.total
    return acc
  }, {})
  const revenueChartData = Object.entries(revenueByDay).map(([day, total]) => ({ day, revenue: total }))

  return (
    <div>
      <AdminPageHeader title="التحليلات" subtitle="أداء المبيعات والمنتجات" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="إجمالي الإيرادات" value={`${revenue.toLocaleString('ar-EG')} ج.م`} icon={<DollarSign className="size-5" />} />
        <StatCard label="متوسط قيمة الطلب" value={`${aov.toLocaleString('ar-EG')} ج.م`} icon={<TrendingUp className="size-5" />} />
        <StatCard label="عدد الطلبات" value={String(orders.length)} icon={<ShoppingBag className="size-5" />} />
        <StatCard label="المنتجات النشطة" value={String(products.filter((p) => !p.archived).length)} icon={<Users className="size-5" />} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-card p-4">
          <p className="font-extrabold text-ink text-sm text-right mb-3">الإيرادات حسب يوم الطلب</p>
          {revenueChartData.length === 0 ? (
            <p className="text-muted text-sm text-center py-16">لا توجد بيانات كافية بعد</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueChartData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-border rounded-card p-4">
          <p className="font-extrabold text-ink text-sm text-right mb-3">المنتجات حسب الفئة</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={salesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {salesByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
