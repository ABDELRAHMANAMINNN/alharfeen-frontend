import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { api, ApiClientError } from '@/services/api'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const phone = (location.state as { phone?: string } | null)?.phone ?? ''
  const mismatch = confirm.length > 0 && password !== confirm

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (mismatch) return
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { phone, newPassword: password })
      navigate('/login')
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'تعذّر تغيير كلمة المرور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="text-right">
        <h1 className="font-extrabold text-ink text-xl">كلمة مرور جديدة</h1>
        <p className="text-muted text-sm mt-1">اختار كلمة مرور قوية وسهلة تفتكرها</p>
      </div>

      <Input label="كلمة المرور الجديدة" type="password" placeholder="••••••••" icon={<Lock className="size-4" />} value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Input
        label="تأكيد كلمة المرور"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="size-4" />}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={mismatch ? 'كلمتا المرور غير متطابقتين' : error || undefined}
        required
      />

      <Button type="submit" fullWidth size="lg" loading={loading} disabled={mismatch}>
        حفظ كلمة المرور
      </Button>
    </form>
  )
}
