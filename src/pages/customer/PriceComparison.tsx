import { useParams } from 'react-router-dom'
import { ShieldCheck, Star, Crown } from 'lucide-react'
import { useProduct, useOffers } from '@/services/catalog'
import Button from '@/components/ui/Button'
import { useCartStore } from '@/hooks/useCartStore'
import { useToastStore } from '@/hooks/useToast'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useNavigate } from 'react-router-dom'
import Placeholder from '@/pages/Placeholder'
import { Skeleton } from '@/components/ui/EmptyState'

export default function PriceComparison() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, loading: productLoading } = useProduct(slug)
  const { data: offers, loading: offersLoading } = useOffers(slug)
  const add = useCartStore((s) => s.add)
  const push = useToastStore((s) => s.push)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  if (productLoading || offersLoading) {
    return <div className="px-4 pt-4 flex flex-col gap-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
  }
  if (!product) return <Placeholder title="المنتج غير موجود" />

  const sorted = [...(offers ?? [])].sort((a, b) => a.price - b.price)
  const bestPrice = sorted[0]?.price

  const onAdd = async (sellerName?: string) => {
    if (!user) {
      push('سجّل الدخول أولًا لإضافة المنتجات للسلة', 'info')
      navigate('/login')
      return
    }
    await add(product.id)
    push(sellerName ? `تمت الإضافة من ${sellerName}` : 'تمت الإضافة إلى السلة')
  }

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
      <div className="text-right">
        <h1 className="font-extrabold text-ink text-lg">قارن الأسعار</h1>
        <p className="text-muted text-sm mt-1">{product.name}</p>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((offer) => {
          const isBest = offer.price === bestPrice
          return (
            <div
              key={offer.sellerId}
              className={`bg-white rounded-card p-4 flex flex-col gap-2.5 border-2 ${isBest ? 'border-brand' : 'border-border'}`}
            >
              {isBest && (
                <span className="self-start flex items-center gap-1 bg-brand text-ink text-[11px] font-extrabold rounded-full px-2.5 py-1">
                  <Crown className="size-3" /> أفضل سعر
                </span>
              )}
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-ink text-xl">{offer.price.toLocaleString('ar-EG')} ج.م</span>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <p className="font-bold text-ink text-sm">{offer.sellerName}</p>
                    {offer.sellerVerified && <ShieldCheck className="size-4 text-success" />}
                  </div>
                  {offer.sellerRating !== undefined && (
                    <div className="flex items-center gap-1 justify-end text-xs text-muted">
                      <span>{offer.sellerRating}</span>
                      <Star className="size-3 fill-brand text-brand" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted border-t border-border pt-2.5">
                <span className="text-right">الحالة: <span className="text-ink font-bold">{offer.condition}</span></span>
                <span className="text-right">التوصيل: <span className="text-ink font-bold">{offer.deliveryEstimate}</span></span>
                <span className="text-right">التوفر: <span className={`font-bold ${offer.inStock ? 'text-success' : 'text-error'}`}>{offer.inStock ? 'متوفر' : 'غير متوفر'}</span></span>
                {offer.warranty && <span className="text-right">الضمان: <span className="text-ink font-bold">{offer.warranty}</span></span>}
              </div>

              <Button
                size="sm"
                variant={isBest ? 'primary' : 'secondary'}
                disabled={!offer.inStock}
                onClick={() => onAdd(offer.sellerName)}
              >
                {offer.inStock ? 'أضف للسلّة' : 'غير متوفر'}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
