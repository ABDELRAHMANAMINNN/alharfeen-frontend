import { Link, useNavigate } from 'react-router-dom'
import { User, Car, MapPin, FileText, Heart, Bell, Settings, HelpCircle, LogOut, ChevronLeft } from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuthStore'

const menu = [
  { to: '/profile/vehicles', label: 'سياراتي', icon: Car },
  { to: '/profile/addresses', label: 'عناويني', icon: MapPin },
  { to: '/orders', label: 'طلباتي', icon: FileText },
  { to: '/favorites', label: 'المفضلة', icon: Heart },
  { to: '/notifications', label: 'الإشعارات', icon: Bell },
  { to: '/profile/settings', label: 'الإعدادات', icon: Settings },
  { to: '/help', label: 'المساعدة', icon: HelpCircle },
]

export default function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-5">
      <div className="flex items-center gap-3 justify-end">
        <div className="text-right">
          <p className="font-extrabold text-ink text-base">{user.name}</p>
          <p className="text-muted text-xs">عرض الملف الشخصي</p>
        </div>
        <div className="bg-brand/10 text-brand-dark p-3.5 rounded-full">
          <User className="size-6" />
        </div>
      </div>

      <div className="bg-white border border-border rounded-card overflow-hidden flex flex-col divide-y divide-border">
        {menu.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="flex items-center justify-between px-4 py-3.5">
            <ChevronLeft className="size-4 text-muted rotate-180" />
            <div className="flex items-center gap-3">
              <span className="font-bold text-ink text-sm">{label}</span>
              <div className="bg-surface p-2 rounded-control text-ink">
                <Icon className="size-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => {
          logout()
          navigate('/login')
        }}
        className="flex items-center justify-center gap-2 text-error font-bold text-sm py-3"
      >
        تسجيل الخروج
        <LogOut className="size-4" />
      </button>
    </div>
  )
}
