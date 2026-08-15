import { Link } from 'react-router-dom'
import { Cpu, Activity, Car, CircleX, Sparkles, Zap, Disc, Filter as FilterIcon } from 'lucide-react'
import { useCategories } from '@/services/catalog'
import { Skeleton } from '@/components/ui/EmptyState'

const icons: Record<string, typeof Cpu> = {
  cpu: Cpu, activity: Activity, car: Car, 'circle-x': CircleX, sparkles: Sparkles, zap: Zap, disc: Disc, filter: FilterIcon,
}

export default function Categories() {
  const { data: categories, loading } = useCategories()

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="font-extrabold text-ink text-lg text-right mb-4">تصفح الأقسام</h1>
      <div className="grid grid-cols-2 gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)
          : categories?.map((c) => {
              const Icon = icons[c.icon] ?? Cpu
              return (
                <Link
                  key={c.id}
                  to={`/categories/${c.id}`}
                  className="bg-white border border-border rounded-card p-4 flex flex-col items-center gap-2.5"
                >
                  <div className="bg-brand/10 text-brand-dark p-3 rounded-[12px]">
                    <Icon className="size-6" />
                  </div>
                  <span className="font-bold text-ink text-sm">{c.name}</span>
                </Link>
              )
            })}
      </div>
    </div>
  )
}
