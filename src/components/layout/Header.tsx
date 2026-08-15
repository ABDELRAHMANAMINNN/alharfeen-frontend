import { ShoppingCart, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '@/components/ui/Logo'
import { useCartStore } from '@/hooks/useCartStore'

export default function Header() {
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))

  return (
    <header className="bg-ink w-full">
      <div className="h-11" /> {/* status-bar spacer */}
      <div className="flex items-center justify-between pb-4 pt-2 px-5">
        <div className="flex gap-3 items-center">
          <Link to="/cart" aria-label="السلة" className="relative bg-ink/50 p-2 rounded-full">
            <ShoppingCart className="size-5 text-body" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-brand text-ink text-[10px] font-extrabold rounded-full size-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/notifications" aria-label="الإشعارات" className="bg-ink/50 p-2 rounded-full">
            <Bell className="size-5 text-body" />
          </Link>
        </div>
        <Link to="/home">
          <Logo size={32} theme="dark" />
        </Link>
      </div>
    </header>
  )
}
