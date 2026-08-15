import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Phone, Lock } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/hooks/useAuthStore'
import { api } from '@/services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const register = useAuthStore((s) => s.register)
  const navigate = useNavigate()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Create the account for real, then send the user through a phone-verification
      // step (mocked OTP) before landing them on Home.
      await register({ name, phone, password })
      await api.post('/auth/otp/request', { phone })
      navigate('/otp', { state: { phone, next: '/home' } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="text-right">
        <h1 className="font-extrabold text-ink text-xl">إنشاء حساب جديد</h1>
        <p className="text-muted text-sm mt-1">هتقدر تلاقي وتطلب قطع غيارك بسهولة</p>
      </div>

      <Input label="الاسم بالكامل" placeholder="اكتب اسمك" icon={<User className="size-4" />} value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="رقم الموبايل" type="tel" placeholder="01xxxxxxxxx" icon={<Phone className="size-4" />} value={phone} onChange={(e) => setPhone(e.target.value)} required />
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

      <Button type="submit" fullWidth size="lg" loading={loading}>
        متابعة
      </Button>

      <p className="text-center text-sm text-muted">
        عندك حساب بالفعل؟{' '}
        <Link to="/login" className="text-brand-dark font-bold">
          سجّل الدخول
        </Link>
      </p>
    </form>
  )
}
