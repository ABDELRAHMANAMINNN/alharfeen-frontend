import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, type FormEvent } from 'react'
import { Search, Car, Cpu, Activity, CircleX, Sparkles, Zap, Disc, Filter as FilterIcon, Package } from 'lucide-react'
import { useVehicleStore } from '@/hooks/useVehicleStore'
import { useCategories, useProducts } from '@/services/catalog'
import ProductCard from '@/components/product/ProductCard'
import { Skeleton } from '@/components/ui/EmptyState'
import { getAssetUrl } from '@/services/api'

const categoryIcons: Record<string, typeof Cpu> = {
  cpu: Cpu, activity: Activity, car: Car, 'circle-x': CircleX, sparkles: Sparkles, zap: Zap, disc: Disc, filter: FilterIcon,
}

export default function Home() {
  const { vehicles, selectedId, fetch: fetchVehicles } = useVehicleStore()
  const selectedVehicle = vehicles.find((v) => v.id === selectedId)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const { data: categories, loading: categoriesLoading } = useCategories()
  const { data: productsData, loading: productsLoading } = useProducts({ sort: 'popular' })
  const products = productsData?.items ?? []
  const deals = products.filter((p) => p.oldPrice)

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-6 md:px-0 md:gap-10">
      {/* Mobile search card */}
      <div className="md:hidden bg-ink rounded-[20px] p-4 flex flex-col gap-3">
        <p className="font-extrabold text-brand text-lg text-right">بتدور على إيه؟</p>
        <p className="text-body/80 text-[13px] text-right">اكتب اسم القطعة، رقمها أو موديل عربيتك</p>
        <Link to="/search" className="bg-white h-12 rounded-control px-4 flex items-center justify-between text-muted text-sm">
          <Search className="size-[18px]" />
          <span>ابحث برقم القطعة أو الاسم...</span>
        </Link>
      </div>

      {/* Desktop hero */}
      <section className="hidden md:flex bg-ink rounded-[24px] p-12 items-center justify-between gap-10">
        <div className="flex-1 flex flex-col items-end gap-5 text-right">
          <h1 className="font-extrabold text-white text-4xl leading-tight">
            دوّر على قطعة الغيار الصح<br />لعربيتك في ثواني
          </h1>
          <p className="text-body/70 text-base max-w-md">
            ابحث، قارن الأسعار من بائعين موثّقين، واطلب اللي محتاجه — كل ده من مكان واحد.
          </p>
          <form onSubmit={onSearch} className="w-full max-w-lg relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث برقم القطعة أو الاسم..."
              className="w-full h-14 rounded-control bg-white pr-12 pl-4 text-sm focus:outline-none"
            />
          </form>
          <div className="flex gap-3">
            <Link to="/vehicles" className="bg-brand text-ink font-bold text-sm rounded-control px-5 py-3">اختر سيارتك</Link>
            <Link to="/categories" className="bg-white/10 text-white font-bold text-sm rounded-control px-5 py-3">تصفح الأقسام</Link>
          </div>
        </div>
        <div className="hidden lg:flex size-64 rounded-full bg-brand/10 items-center justify-center shrink-0">
          <Car className="size-28 text-brand" strokeWidth={1.2} />
        </div>
      </section>

      {/* Vehicle */}
      <Link
        to="/vehicles"
        className="bg-white border border-border rounded-2xl p-3.5 md:p-5 flex items-center justify-between md:max-w-md"
      >
        <span className="bg-brand/10 text-brand-dark text-xs font-bold rounded-[10px] px-3 py-1.5">تغيير السيارة</span>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-muted text-xs">عربيتك الحالية</span>
            <span className="font-bold text-ink text-sm">
              {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.year}` : 'اختر سيارتك'}
            </span>
          </div>
          <div className="bg-surface p-2.5 rounded-control">
            <Car className="size-5" />
          </div>
        </div>
      </Link>

      {/* Categories */}
      <div className="flex flex-col gap-3">
        <p className="font-extrabold text-ink text-base md:text-xl text-right">تسوق حسب الفئة</p>
        {categoriesLoading ? (
          <div className="flex gap-2 justify-end">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-[68px] h-[76px]" />)}</div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-end md:grid md:grid-cols-8 md:gap-3">
            {categories?.map((cat) => {
              const Icon = categoryIcons[cat.icon] ?? Cpu
              return (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.id}`}
                  className="bg-white border border-border rounded-control p-3 flex flex-col gap-2 items-center w-[68px] md:w-full md:p-4 hover:border-brand transition-colors"
                >
                  <div className="bg-surface p-2.5 rounded-[10px]">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-[11px] font-bold text-ink text-center truncate w-full">{cat.name}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Deals */}
      {deals.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-brand text-[13px] font-bold">عرض الكل</span>
            <p className="font-extrabold text-ink text-base md:text-xl">🔥 عروض اليوم الكبرى</p>
          </div>
          <div className="flex gap-3 overflow-x-auto md:grid md:grid-cols-4 md:gap-4">
            {deals.map((p) => (
              <Link key={p.id} to={`/products/${p.slug}`} className="bg-white border border-border rounded-2xl p-3 flex flex-col gap-2.5 w-[174px] md:w-full shrink-0 hover:border-brand transition-colors">
                <div className="h-[100px] md:h-40 rounded-control bg-surface flex items-center justify-center text-muted text-xs overflow-hidden">
                  {p.image ? (
                    <img src={getAssetUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="size-6" />
                  )}
                </div>
                <p className="font-bold text-ink text-[13px] text-right truncate">{p.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-muted text-[11px] line-through">{p.oldPrice?.toLocaleString('ar-EG')} ج.م</span>
                  <span className="font-extrabold text-error text-sm">{p.price.toLocaleString('ar-EG')} ج.م</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular */}
      <div className="flex flex-col gap-3">
        <p className="font-extrabold text-ink text-base md:text-xl text-right">قطع غيار رائجة ومطلوبة</p>
        {productsLoading ? (
          <div className="flex flex-col gap-2.5 md:grid md:grid-cols-4 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 md:h-64" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 md:grid md:grid-cols-4 md:gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
