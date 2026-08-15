import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Phone, Lock } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/hooks/useAuthStore'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(phone, password)
      navigate(user.role === 'ADMIN' ? '/admin' : '/home')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="text-right">
        <h1 className="font-extrabold text-ink text-xl">أهلاً بيك تاني</h1>
        <p className="text-muted text-sm mt-1">سجّل دخولك عشان تكمل التسوق</p>
      </div>

      <Input
        label="رقم الموبايل"
        type="tel"
        placeholder="01xxxxxxxxx"
        icon={<Phone className="size-4" />}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <Input
        label="كلمة المرور"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="size-4" />}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error || undefined}
        required
      />

      <Link to="/forgot-password" className="text-brand-dark text-sm font-bold self-start">
        نسيت كلمة المرور؟
      </Link>

      <Button type="submit" fullWidth size="lg" loading={loading}>
        تسجيل الدخول
      </Button>

      <p className="text-center text-sm text-muted">
        مستخدم جديد؟{' '}
        <Link to="/register" className="text-brand-dark font-bold">
          أنشئ حساب
        </Link>
      </p>

      <p className="text-center text-[11px] text-muted border-t border-border pt-3">
        للتجربة: 01111111111 / customer123 (عميل) — 01000000000 / admin1234 (إدارة)
      </p>
    </form>
  )
}
