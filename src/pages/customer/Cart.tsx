import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingCart, Package } from 'lucide-react'
import { useCartStore } from '@/hooks/useCartStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useSellers } from '@/services/catalog'
import { EmptyState, Skeleton } from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

const DELIVERY_FEE = 60

export default function Cart() {
  const { items, subtotal, loading, fetch, setQuantity, remove } = useCartStore()
  const user = useAuthStore((s) => s.user)
  const { data: sellers } = useSellers()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) fetch()
  }, [user, fetch])

  const total = items.length ? subtotal + DELIVERY_FEE : 0

  const bySeller = items.reduce<Record<string, typeof items>>((acc, item) => {
    acc[item.sellerId] = [...(acc[item.sellerId] ?? []), item]
    return acc
  }, {})

  if (!user) {
    return (
      <EmptyState
        icon={<ShoppingCart className="size-7" />}
        title="سجّل الدخول لعرض السلة"
        description="السلة مرتبطة بحسابك، سجّل الدخول عشان تكمل تسوقك."
        actionLabel="تسجيل الدخول"
        onAction={() => navigate('/login')}
      />
    )
  }

  if (loading) {
    return <div className="p-4 flex flex-col gap-3"><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart className="size-7" />}
        title="السلة فاضية"
        description="ابدأ تسوقك دلوقتي وأضف قطع الغيار اللي محتاجها."
        actionLabel="تصفح المنتجات"
        onAction={() => navigate('/products')}
      />
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 px-4 pt-4 pb-40 md:px-0 md:pb-6">
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="font-extrabold text-ink text-lg md:text-xl text-right">السلة</h1>

        {Object.entries(bySeller).map(([sellerId, sellerLines]) => {
          const seller = sellers?.find((s) => s.id === sellerId)
          return (
            <div key={sellerId} className="bg-white border border-border rounded-card overflow-hidden">
              <div className="bg-surface px-3.5 py-2.5 text-right">
                <span className="text-xs font-bold text-ink">{seller?.name ?? '...'}</span>
              </div>
              <div className="flex flex-col divide-y divide-border">
                {sellerLines.map((item) => (
                  <div key={item.productId} className="flex gap-3 p-3.5">
                    <button onClick={() => remove(item.productId)} className="text-muted self-start" aria-label="حذف">
                      <Trash2 className="size-4" />
                    </button>
                    <div className="flex-1 flex flex-col gap-1.5 items-end text-right">
                      <Link to={`/products/${item.slug}`} className="font-bold text-ink text-sm">{item.name}</Link>
                      <span className="font-extrabold text-ink text-sm">{item.price.toLocaleString('ar-EG')} ج.م</span>
                      <div className="flex items-center gap-2 bg-surface rounded-full px-1 py-1">
                        <button onClick={() => setQuantity(item.productId, item.quantity + 1)} className="size-6 flex items-center justify-center">
                          <Plus className="size-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => setQuantity(item.productId, item.quantity - 1)} className="size-6 flex items-center justify-center">
                          <Minus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="size-16 rounded-control bg-surface shrink-0 flex items-center justify-center text-muted">
                      <Package className="size-6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="hidden md:flex md:flex-col md:w-80 md:shrink-0 bg-white border border-border rounded-card p-5 gap-3 h-fit sticky top-24">
        <p className="font-extrabold text-ink text-base text-right mb-1">ملخص الطلب</p>
        <div className="flex justify-between text-sm text-muted"><span>{subtotal.toLocaleString('ar-EG')} ج.م</span><span>المجموع الفرعي</span></div>
        <div className="flex justify-between text-sm text-muted"><span>{DELIVERY_FEE.toLocaleString('ar-EG')} ج.م</span><span>التوصيل</span></div>
        <div className="flex justify-between font-extrabold text-ink text-base border-t border-border pt-2.5"><span>{total.toLocaleString('ar-EG')} ج.م</span><span>الإجمالي</span></div>
        <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>متابعة للدفع</Button>
      </div>

      <div className="md:hidden fixed bottom-[72px] inset-x-0 max-w-md mx-auto bg-white border-t border-border p-4 flex flex-col gap-2.5">
        <div className="flex justify-between text-sm text-muted"><span>{subtotal.toLocaleString('ar-EG')} ج.م</span><span>المجموع الفرعي</span></div>
        <div className="flex justify-between text-sm text-muted"><span>{DELIVERY_FEE.toLocaleString('ar-EG')} ج.م</span><span>التوصيل</span></div>
        <div className="flex justify-between font-extrabold text-ink text-base border-t border-border pt-2.5"><span>{total.toLocaleString('ar-EG')} ج.م</span><span>الإجمالي</span></div>
        <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>متابعة للدفع</Button>
      </div>
    </div>
  )
}
