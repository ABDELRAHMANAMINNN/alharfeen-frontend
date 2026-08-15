import { NavLink } from 'react-router-dom'
import { User, Heart, FileText, Grid, Home } from 'lucide-react'

const items = [
  { to: '/home', label: 'الرئيسية', icon: Home },
  { to: '/categories', label: 'الفئات', icon: Grid },
  { to: '/orders', label: 'طلباتي', icon: FileText },
  { to: '/favorites', label: 'المفضلة', icon: Heart },
  { to: '/profile', label: 'حسابي', icon: User },
]

export default function BottomNavigation() {
  return (
    <nav className="bg-white border-t border-border flex items-center justify-between px-3 py-2 h-[72px] sticky bottom-0 w-full">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 w-16 ${isActive ? 'text-brand' : 'text-muted'}`
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="size-[22px]" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[11px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
