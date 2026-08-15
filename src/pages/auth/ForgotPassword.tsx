import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { api, ApiClientError } from '@/services/api'

export default function ForgotPassword() {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/otp/request', { phone })
      navigate('/otp', { state: { phone, next: '/reset-password' } })
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'تعذّر إرسال الكود')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="text-right">
        <h1 className="font-extrabold text-ink text-xl">نسيت كلمة المرور؟</h1>
        <p className="text-muted text-sm mt-1">هنبعتلك كود تحقق على رقم موبايلك</p>
      </div>

      <Input
        label="رقم الموبايل"
        type="tel"
        placeholder="01xxxxxxxxx"
        icon={<Phone className="size-4" />}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={error || undefined}
        required
      />

      <Button type="submit" fullWidth size="lg" loading={loading}>
        إرسال كود التحقق
      </Button>
    </form>
  )
}
