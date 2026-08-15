import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, SlidersHorizontal, PackageSearch } from 'lucide-react'
import { useCategories, useProducts } from '@/services/catalog'
import ProductCard from '@/components/product/ProductCard'
import { EmptyState, ProductCardSkeleton } from '@/components/ui/EmptyState'
import { Drawer } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

const RECENT_KEY = 'alharafyeen-recent-searches'

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
  } catch {
    return []
  }
}

export default function Search() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [recent, setRecent] = useState<string[]>(getRecent())
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [category, setCategory] = useState<string | null>(null)
  const { data: categories } = useCategories()

  const activeQuery = params.get('q') ?? ''
  const { data, loading } = useProducts({ q: activeQuery || undefined, categoryId: category ?? undefined })
  const results = data?.items ?? []

  const submit = (q: string) => {
    if (!q.trim()) return
    setParams({ q })
    const next = [q, ...recent.filter((r) => r !== q)].slice(0, 6)
    setRecent(next)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-6">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <SearchIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit(query)}
            placeholder="ابحث برقم القطعة أو الاسم..."
            className="w-full h-12 rounded-control border border-border bg-white pr-10 pl-3 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="size-12 shrink-0 rounded-control border border-border bg-white flex items-center justify-center text-ink"
          aria-label="الفلاتر"
        >
          <SlidersHorizontal className="size-5" />
        </button>
      </div>

      {!activeQuery && recent.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-bold text-ink text-sm text-right">عمليات بحث سابقة</p>
          <div className="flex flex-wrap gap-2 justify-end">
            {recent.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setQuery(r)
                  submit(r)
                }}
                className="bg-surface text-ink text-xs font-bold rounded-full px-3 py-1.5"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeQuery && !loading && (
        <p className="text-muted text-sm text-right">
          {results.length} نتيجة عن "{activeQuery}"
        </p>
      )}

      {loading ? (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : activeQuery && results.length === 0 ? (
        <EmptyState
          icon={<PackageSearch className="size-7" />}
          title="مفيش نتائج"
          description="جرّب كلمة بحث تانية أو غيّر الفلاتر."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="الفلاتر">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold text-ink text-sm mb-2 text-right">الفئة</p>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => setCategory(null)}
                className={`text-xs font-bold rounded-full px-3 py-1.5 ${!category ? 'bg-brand text-ink' : 'bg-surface text-ink'}`}
              >
                الكل
              </button>
              {categories?.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`text-xs font-bold rounded-full px-3 py-1.5 ${category === c.id ? 'bg-brand text-ink' : 'bg-surface text-ink'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <Button fullWidth onClick={() => setFiltersOpen(false)}>
            عرض النتائج
          </Button>
        </div>
      </Drawer>
    </div>
  )
}
