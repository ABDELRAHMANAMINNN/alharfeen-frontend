import { useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFavoritesStore } from '@/hooks/useFavoritesStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import ProductCard from '@/components/product/ProductCard'
import { EmptyState, ProductCardSkeleton } from '@/components/ui/EmptyState'

export default function Favorites() {
  const { products, loading, fetch } = useFavoritesStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) fetch()
  }, [user, fetch])

  if (!user) {
    return (
      <div className="px-4 pt-4 pb-6">
        <EmptyState
          icon={<Heart className="size-7" />}
          title="سجّل الدخول لعرض المفضلة"
          description="عشان تحفظ منتجاتك المفضلة، لازم تسجّل الدخول الأول."
          actionLabel="تسجيل الدخول"
          onAction={() => navigate('/login')}
        />
      </div>
    )
  }

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
      <h1 className="font-extrabold text-ink text-lg text-right">المفضلة</h1>

      {loading ? (
        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Heart className="size-7" />}
          title="مفيش منتجات في المفضلة"
          description="اضغط على أيقونة القلب في أي منتج عشان تحفظه هنا."
          actionLabel="تصفح المنتجات"
          onAction={() => navigate('/products')}
        />
      ) : (
        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
