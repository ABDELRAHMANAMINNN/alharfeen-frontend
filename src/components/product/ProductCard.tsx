import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import type { Product } from '@/types'
import { VerificationBadge } from '@/components/ui/Badge'
import { useCartStore } from '@/hooks/useCartStore'
import { useToastStore } from '@/hooks/useToast'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { getAssetUrl } from '@/services/api'

export default function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add)
  const push = useToastStore((s) => s.push)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleAdd = async () => {
    if (!user) {
      push('سجّل الدخول أولًا لإضافة المنتجات للسلة', 'info')
      navigate('/login')
      return
    }
    try {
      await add(product.id)
      push('تمت الإضافة إلى السلة')
    } catch {
      push('تعذّرت الإضافة، حاول مرة أخرى', 'error')
    }
  }

  return (
    <div className="bg-white border border-border rounded-card p-3 flex md:flex-col gap-3 w-full">
      <Link
        to={`/products/${product.slug}`}
        className="size-20 md:size-full md:h-40 rounded-control bg-surface shrink-0 flex items-center justify-center text-muted order-last md:order-first overflow-hidden"
      >
        {product.image ? (
          <img src={getAssetUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="size-8 md:size-10" />
        )}
      </Link>
      <div className="flex-1 flex flex-col gap-1 items-end text-right">
        <Link to={`/products/${product.slug}`} className="font-bold text-ink text-sm hover:text-brand-dark line-clamp-2">
          {product.name}
        </Link>
        <p className="text-muted text-[11px]">{product.compatibility}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-muted text-[11px]">{product.sellerName}</span>
          {product.sellerVerified && <VerificationBadge label="" />}
        </div>
        <div className="flex items-center justify-between w-full pt-1 md:flex-col md:items-end md:gap-2">
          <div className="flex items-baseline gap-1.5">
            {product.oldPrice && (
              <span className="text-muted text-[11px] line-through">{product.oldPrice.toLocaleString('ar-EG')} ج.م</span>
            )}
            <span className="font-extrabold text-ink text-[15px]">{product.price.toLocaleString('ar-EG')} ج.م</span>
          </div>
          <button
            onClick={handleAdd}
            className="bg-brand text-ink text-xs font-bold rounded-[8px] px-2.5 py-1 hover:bg-brand-dark transition-colors md:w-full"
            disabled={!product.inStock}
          >
            {product.inStock ? 'أضف للسلّة' : 'غير متوفر'}
          </button>
        </div>
      </div>
    </div>
  )
}
