import { useParams } from 'react-router-dom'
import { ShieldCheck, MapPin, Clock, Package, Star } from 'lucide-react'
import { useSeller, useSellerProducts } from '@/services/catalog'
import ProductCard from '@/components/product/ProductCard'
import Placeholder from '@/pages/Placeholder'
import { Skeleton } from '@/components/ui/EmptyState'

export default function SellerProfile() {
  const { id } = useParams<{ id: string }>()
  const { data: seller, loading } = useSeller(id)
  const { data: productsData } = useSellerProducts(id)
  const items = productsData?.items ?? []

  if (loading) {
    return <div className="p-4 flex flex-col gap-3"><Skeleton className="h-32" /><Skeleton className="h-20" /></div>
  }
  if (!seller) return <Placeholder title="البائع غير موجود" />

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="bg-ink text-body p-5 flex flex-col items-center gap-2 text-center">
        <div className="size-16 rounded-full bg-white/10 flex items-center justify-center">
          <Package className="size-7" />
        </div>
        <div className="flex items-center gap-1.5">
          <h1 className="font-extrabold text-lg">{seller.name}</h1>
          {seller.verified && <ShieldCheck className="size-5 text-success" />}
        </div>
        <div className="flex items-center gap-1 text-brand text-sm">
          <span>{seller.rating}</span>
          <Star className="size-3.5 fill-brand" />
          <span className="text-body/60">({seller.reviewCount} تقييم)</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4">
        <div className="bg-white border border-border rounded-card p-3 flex flex-col items-center gap-1">
          <MapPin className="size-4 text-muted" />
          <span className="text-[11px] text-muted">{seller.location}</span>
        </div>
        <div className="bg-white border border-border rounded-card p-3 flex flex-col items-center gap-1">
          <Clock className="size-4 text-muted" />
          <span className="text-[11px] text-muted">استجابة {seller.responseRate}%</span>
        </div>
        <div className="bg-white border border-border rounded-card p-3 flex flex-col items-center gap-1">
          <Package className="size-4 text-muted" />
          <span className="text-[11px] text-muted">{seller.productCount} منتج</span>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3">
        <p className="font-extrabold text-ink text-sm text-right">منتجات البائع</p>
        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
