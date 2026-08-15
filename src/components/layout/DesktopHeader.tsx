import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import { Search, ShoppingCart, Bell, User, Car } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useCartStore } from '@/hooks/useCartStore'
import { useVehicleStore } from '@/hooks/useVehicleStore'

const navItems = [
  { to: '/home', label: 'الرئيسية' },
  { to: '/categories', label: 'الأقسام' },
  { to: '/products', label: 'المنتجات' },
  { to: '/about', label: 'من نحن' },
]

export default function DesktopHeader() {
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const { vehicles, selectedId } = useVehicleStore()
  const selectedVehicle = vehicles.find((v) => v.id === selectedId)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="hidden md:block bg-ink sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center gap-6 px-8 py-4">
        <Link to="/home"><Logo size={34} theme="dark" /></Link>

        <nav className="flex items-center gap-6">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `text-sm font-bold ${isActive ? 'text-brand' : 'text-body/80 hover:text-body'}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={onSearch} className="flex-1 relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث برقم القطعة أو الاسم أو الماركة..."
            className="w-full h-11 rounded-control bg-white pr-10 pl-4 text-sm focus:outline-none"
          />
        </form>

        <Link to="/vehicles" className="flex items-center gap-2 bg-white/10 text-body rounded-control px-3 py-2 text-xs font-bold shrink-0">
          <Car className="size-4" />
          {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'اختر سيارتك'}
        </Link>

        <div className="flex items-center gap-1 shrink-0">
          <Link to="/notifications" className="p-2.5 text-body/80 hover:text-body" aria-label="الإشعارات"><Bell className="size-5" /></Link>
          <Link to="/cart" className="p-2.5 text-body/80 hover:text-body relative" aria-label="السلة">
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 left-0.5 bg-brand text-ink text-[10px] font-extrabold rounded-full size-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className="p-2.5 text-body/80 hover:text-body" aria-label="حسابي"><User className="size-5" /></Link>
        </div>
      </div>
    </header>
  )
}
