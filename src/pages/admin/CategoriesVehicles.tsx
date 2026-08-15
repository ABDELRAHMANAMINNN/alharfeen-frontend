import { useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { useCategories } from '@/services/catalog'
import { useVehicleStore } from '@/hooks/useVehicleStore'
import { Skeleton } from '@/components/ui/EmptyState'
import { Cpu, Activity, Car, CircleX, Sparkles, Zap, Disc, Filter as FilterIcon } from 'lucide-react'

const icons: Record<string, typeof Cpu> = { cpu: Cpu, activity: Activity, car: Car, 'circle-x': CircleX, sparkles: Sparkles, zap: Zap, disc: Disc, filter: FilterIcon }

export default function CategoriesVehicles() {
  const [tab, setTab] = useState<'categories' | 'vehicles'>('categories')
  const { data: categories, loading } = useCategories()
  const { vehicles } = useVehicleStore()

  return (
    <div>
      <AdminPageHeader title="الأقسام والمركبات" subtitle="إدارة فئات المنتجات وقاعدة بيانات السيارات" />

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('categories')} className={`text-xs font-bold rounded-full px-4 py-1.5 ${tab === 'categories' ? 'bg-brand text-ink' : 'bg-white border border-border'}`}>الأقسام</button>
        <button onClick={() => setTab('vehicles')} className={`text-xs font-bold rounded-full px-4 py-1.5 ${tab === 'vehicles' ? 'bg-brand text-ink' : 'bg-white border border-border'}`}>المركبات</button>
      </div>

      {tab === 'categories' ? (
        loading ? (
          <div className="grid grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {categories?.map((c) => {
              const Icon = icons[c.icon] ?? Cpu
              return (
                <div key={c.id} className="bg-white border border-border rounded-card p-4 flex items-center justify-between">
                  <div className="bg-brand/10 text-brand-dark p-2.5 rounded-control"><Icon className="size-5" /></div>
                  <span className="font-bold text-ink text-sm">{c.name}</span>
                </div>
              )
            })}
          </div>
        )
      ) : (
        <div className="bg-white border border-border rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs border-b border-border">
                <th className="text-right font-bold px-4 py-2">الماركة</th>
                <th className="text-right font-bold px-4 py-2">الموديل</th>
                <th className="text-right font-bold px-4 py-2">السنة</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-muted text-sm">هذا العرض يوضح مركبات الحساب الحالي فقط — قاعدة بيانات المركبات الكاملة تحتاج جدول منفصل للماركات/الموديلات لم يُبنَ بعد.</td></tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-right font-bold text-ink">{v.make}</td>
                    <td className="px-4 py-3 text-right text-muted">{v.model}</td>
                    <td className="px-4 py-3 text-right text-muted">{v.year}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
