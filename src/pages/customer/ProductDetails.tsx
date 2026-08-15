import { useParams, Link, useNavigate } from 'react-router-dom'
import { Package, Heart, ShieldCheck, Truck, ChevronLeft, Scale } from 'lucide-react'
import { useProduct, useOffers, useRelatedProducts } from '@/services/catalog'
import { Rating } from '@/components/ui/Card'
import { VerificationBadge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ProductCard from '@/components/product/ProductCard'
import { useCartStore } from '@/hooks/useCartStore'
import { useFavoritesStore } from '@/hooks/useFavoritesStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useToastStore } from '@/hooks/useToast'
import { getAssetUrl } from '@/services/api'
import Placeholder from '@/pages/Placeholder'
import { Skeleton } from '@/components/ui/EmptyState'

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, loading } = useProduct(slug)
  const { data: offers } = useOffers(slug)
  const { data: related } = useRelatedProducts(slug)
  const navigate = useNavigate()
  const add = useCartStore((s) => s.add)
  const { toggle, isFavorite } = useFavoritesStore()
  const user = useAuthStore((s) => s.user)
  const push = useToastStore((s) => s.push)

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    )
  }
  if (!product) return <Placeholder title="المنتج غير موجود" />

  const favorite = isFavorite(product.id)

  const onAddToCart = async () => {
    if (!user) {
      push('سجّل الدخول أولًا لإضافة المنتجات للسلة', 'info')
      navigate('/login')
      return
    }
    await add(product.id)
    push('تمت الإضافة إلى السلة')
  }

  const onToggleFavorite = () => {
    if (!user) {
      push('سجّل الدخول أولًا لحفظ المفضلة', 'info')
      navigate('/login')
      return
    }
    toggle(product.id)
  }

  const buyButtons = (
    <>
      <Button variant="secondary" fullWidth icon={<ShieldCheck className="size-4" />}>اطلب تسعيرة</Button>
      <Button fullWidth disabled={!product.inStock} onClick={onAddToCart}>
        {product.inStock ? 'أضف للسلّة' : 'غير متوفر'}
      </Button>
    </>
  )

  return (
    <div className="flex flex-col gap-5 pb-24 md:pb-10 md:px-0 md:max-w-6xl md:mx-auto">
      <div className="md:flex md:gap-8 md:items-start">
        <div className="relative bg-surface h-64 md:h-96 md:flex-1 md:rounded-card flex items-center justify-center md:sticky md:top-24 overflow-hidden">
          <button onClick={() => navigate(-1)} className="md:hidden absolute top-4 right-4 bg-white p-2 rounded-full shadow"><ChevronLeft className="size-5 rotate-180" /></button>
          <button onClick={onToggleFavorite} className="absolute top-4 left-4 bg-white p-2 rounded-full shadow" aria-label="أضف للمفضلة">
            <Heart className={`size-5 ${favorite ? 'fill-error text-error' : 'text-muted'}`} />
          </button>
          {product.image ? (
            <img src={getAssetUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="size-16 md:size-24 text-muted" />
          )}
        </div>

        <div className="px-4 md:px-0 flex flex-col gap-4 md:w-96 md:shrink-0">
          <div className="text-right">
            <p className="text-muted text-xs">{product.brand} · {product.partNumber}</p>
            <h1 className="font-extrabold text-ink text-lg md:text-2xl mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 justify-end mt-1.5">
              <Rating value={product.rating} count={product.reviewCount} />
            </div>
          </div>

          <div className="bg-brand/10 text-brand-dark text-xs font-bold rounded-control px-3 py-2 text-right">
            ✓ متوافق مع سيارتك — {product.compatibility}
          </div>

          <div className="flex items-baseline justify-end gap-2">
            {product.oldPrice && <span className="text-muted text-sm line-through">{product.oldPrice.toLocaleString('ar-EG')} ج.م</span>}
            <span className="font-extrabold text-ink text-2xl">{product.price.toLocaleString('ar-EG')} ج.م</span>
          </div>

          <Link to={`/sellers/${product.sellerId}`} className="flex items-center justify-between bg-white border border-border rounded-card p-3.5">
            <ChevronLeft className="size-4 text-muted rotate-180" />
            <div className="text-right">
              <p className="font-bold text-ink text-sm">{product.sellerName}</p>
              {product.sellerVerified && <VerificationBadge />}
            </div>
          </Link>

          <div className="flex items-center gap-2 justify-end text-muted text-xs">
            <span>التوصيل خلال {product.deliveryEstimate}</span>
            <Truck className="size-4" />
          </div>

          {offers && offers.length > 1 && (
            <Link to={`/products/${product.slug}/compare`} className="flex items-center justify-between bg-info/10 text-info rounded-control px-3.5 py-3 font-bold text-sm">
              <Scale className="size-4" />
              <span>قارن {offers.length} عروض من بائعين مختلفين</span>
            </Link>
          )}

          <div className="hidden md:flex gap-2">{buyButtons}</div>
        </div>
      </div>

      <div className="px-4 md:px-0 flex flex-col gap-4 md:max-w-3xl">
        <div className="border-t border-border pt-4">
          <p className="font-extrabold text-ink text-sm text-right mb-2">الوصف</p>
          <p className="text-muted text-sm text-right leading-relaxed">{product.description}</p>
        </div>

        <div className="border-t border-border pt-4">
          <p className="font-extrabold text-ink text-sm text-right mb-2">المواصفات</p>
          <div className="flex flex-col gap-1.5">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-ink font-bold">{v}</span>
                <span className="text-muted">{k}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related && related.length > 0 && (
        <div className="px-4 md:px-0 border-t border-border pt-4">
          <p className="font-extrabold text-ink text-sm text-right mb-3">منتجات ذات صلة</p>
          <div className="flex flex-col gap-2.5 md:grid md:grid-cols-4 md:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-[72px] inset-x-0 max-w-md mx-auto bg-white border-t border-border p-3 flex gap-2">
        {buyButtons}
      </div>
    </div>
  )
}
