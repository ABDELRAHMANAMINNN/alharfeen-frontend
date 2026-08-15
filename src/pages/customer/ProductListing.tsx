import { useState } from 'react'
import { useCategories, useProducts, type ProductListParams } from '@/services/catalog'
import ProductCard from '@/components/product/ProductCard'
import { EmptyState, ProductCardSkeleton } from '@/components/ui/EmptyState'
import { PackageSearch, ArrowUpDown } from 'lucide-react'

export default function ProductListing() {
  const [category, setCategory] = useState<string | null>(null)
  const [sort, setSort] = useState<NonNullable<ProductListParams['sort']>>('popular')
  const { data: categories } = useCategories()
  const { data, loading } = useProducts({ categoryId: category ?? undefined, sort })
  const list = data?.items ?? []

  const CategoryChips = (
    <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
      <button
        onClick={() => setCategory(null)}
        className={`shrink-0 text-xs font-bold rounded-full px-3 py-1.5 ${!category ? 'bg-brand text-ink' : 'bg-white border border-border text-ink'}`}
      >
        الكل
      </button>
      {categories?.map((c) => (
        <button
          key={c.id}
          onClick={() => setCategory(c.id)}
          className={`shrink-0 text-xs font-bold rounded-full px-3 py-1.5 ${category === c.id ? 'bg-brand text-ink' : 'bg-white border border-border text-ink'}`}
        >
          {c.name}
        </button>
      ))}
    </div>
  )

  const CategorySidebar = (
    <aside className="hidden md:flex md:flex-col md:gap-1 md:w-56 md:shrink-0 bg-white border border-border rounded-card p-3 h-fit">
      <p className="font-extrabold text-ink text-sm px-2 py-2 text-right">الفئات</p>
      <button
        onClick={() => setCategory(null)}
        className={`text-sm font-bold rounded-control px-3 py-2 text-right ${!category ? 'bg-brand/10 text-brand-dark' : 'text-ink hover:bg-surface'}`}
      >
        كل المنتجات
      </button>
      {categories?.map((c) => (
        <button
          key={c.id}
          onClick={() => setCategory(c.id)}
          className={`text-sm font-bold rounded-control px-3 py-2 text-right ${category === c.id ? 'bg-brand/10 text-brand-dark' : 'text-ink hover:bg-surface'}`}
        >
          {c.name}
        </button>
      ))}
    </aside>
  )

  return (
    <div className="px-4 pt-4 pb-6 md:px-0 flex flex-col md:flex-row gap-4 md:gap-6">
      {CategorySidebar}

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSort(sort === 'price-asc' ? 'price-desc' : sort === 'price-desc' ? 'popular' : 'price-asc')}
            className="flex items-center gap-1.5 text-xs font-bold text-muted"
          >
            <ArrowUpDown className="size-3.5" />
            {sort === 'popular' ? 'الأكثر رواجًا' : sort === 'price-asc' ? 'السعر: من الأقل' : 'السعر: من الأعلى'}
          </button>
          <h1 className="font-extrabold text-ink text-lg md:text-xl">كل المنتجات</h1>
        </div>

        {CategoryChips}

        {loading ? (
          <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : list.length === 0 ? (
          <EmptyState icon={<PackageSearch className="size-7" />} title="مفيش منتجات" />
        ) : (
          <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
