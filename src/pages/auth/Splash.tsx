import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '@/components/ui/Logo'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/onboarding', { replace: true }), 1400)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-4">
      <Logo size={72} theme="dark" variant="icon" className="animate-pulse" />
      <span className="font-extrabold text-brand text-2xl">الحرفيين</span>
      <span className="text-body/60 text-sm">سوق قطع غيار السيارات</span>
    </div>
  )
}
