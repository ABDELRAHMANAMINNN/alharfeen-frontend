import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tag,
  Percent,
  Store,
  ClipboardList,
  Boxes,
  Grid3x3,
  BarChart3,
  Settings,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'

const items = [
  { to: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'المنتجات', icon: Package },
  { to: '/admin/pricing', label: 'إدارة الأسعار', icon: Tag },
  { to: '/admin/promotions', label: 'العروض', icon: Percent },
  { to: '/admin/sellers', label: 'البائعون', icon: Store },
  { to: '/admin/orders', label: 'الطلبات', icon: ClipboardList },
  { to: '/admin/inventory', label: 'المخزون', icon: Boxes },
  { to: '/admin/categories', label: 'الأقسام والمركبات', icon: Grid3x3 },
  { to: '/admin/analytics', label: 'التحليلات', icon: BarChart3 },
  { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
]

export default function AdminSidebar() {
  return (
    <aside className="w-64 shrink-0 bg-ink text-body h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b border-white/10">
        <Logo size={30} theme="dark" />
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-control text-sm font-bold transition-colors ${
                isActive ? 'bg-brand text-ink' : 'text-body/80 hover:bg-white/5'
              }`
            }
          >
            <Icon className="size-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
