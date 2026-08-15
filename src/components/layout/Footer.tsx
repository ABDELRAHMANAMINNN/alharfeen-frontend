import { Link } from 'react-router-dom'
import Logo from '@/components/ui/Logo'

const columns = [
  {
    title: 'الشركة',
    links: [
      { to: '/about', label: 'من نحن' },
      { to: '/help', label: 'مركز المساعدة' },
    ],
  },
  {
    title: 'للعملاء',
    links: [
      { to: '/orders', label: 'طلباتي' },
      { to: '/favorites', label: 'المفضلة' },
      { to: '/profile', label: 'حسابي' },
    ],
  },
  {
    title: 'قانوني',
    links: [
      { to: '/terms', label: 'الشروط والأحكام' },
      { to: '/privacy', label: 'سياسة الخصوصية' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="hidden md:block bg-ink text-body mt-12">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-4 gap-8">
        <div>
          <Logo size={32} theme="dark" />
          <p className="text-body/60 text-sm mt-3 leading-relaxed">
            سوق قطع غيار السيارات الأول في مصر — نوصلك بأفضل الحرفيين والبائعين الموثّقين.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-bold text-sm mb-3">{col.title}</p>
            <div className="flex flex-col gap-2">
              {col.links.map((l) => (
                <Link key={l.to} to={l.to} className="text-body/60 text-sm hover:text-body">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-body/50 text-xs">
        © {new Date().getFullYear()} الحرفيين. جميع الحقوق محفوظة.
      </div>
    </footer>
  )
}
