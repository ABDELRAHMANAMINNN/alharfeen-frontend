import { useParams, Link } from 'react-router-dom'
import { ChevronRight, PackageSearch } from 'lucide-react'
import { useCategories, useProducts } from '@/services/catalog'
import ProductCard from '@/components/product/ProductCard'
import { EmptyState, ProductCardSkeleton } from '@/components/ui/EmptyState'

export default function CategoryDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: categories } = useCategories()
  const category = categories?.find((c) => c.id === id)
  const { data, loading } = useProducts({ categoryId: id })
  const items = data?.items ?? []

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 justify-end">
        <h1 className="font-extrabold text-ink text-lg">{category?.name ?? 'الفئة'}</h1>
        <Link to="/categories" className="text-muted"><ChevronRight className="size-5" /></Link>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={<PackageSearch className="size-7" />} title="مفيش منتجات في القسم ده حاليًا" description="جرّب قسم تاني أو ارجع لاحقًا." />
      ) : (
        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
