import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { api, ApiClientError } from '@/services/api'

export default function Otp() {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { phone?: string; next?: string } | null
  const phone = state?.phone ?? ''
  const next = state?.next ?? '/home'

  const onChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const nextDigits = [...digits]
    nextDigits[i] = val
    setDigits(nextDigits)
    if (val && i < 3) refs.current[i + 1]?.focus()
  }

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/otp/verify', { phone, code: digits.join('') })
      navigate(next, next === '/home' ? undefined : { state: { phone } })
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'كود التحقق غير صحيح')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="text-right">
        <h1 className="font-extrabold text-ink text-xl">أدخل كود التحقق</h1>
        <p className="text-muted text-sm mt-1">بعتنالك كود مكوّن من ٤ أرقام على رقم موبايلك</p>
        <p className="text-muted text-[11px] mt-1">للتجربة: الكود هو 1234</p>
      </div>

      <div className="flex justify-center gap-3" dir="ltr">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el }}
            value={d}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="size-14 text-center text-xl font-extrabold rounded-control border border-border focus:border-brand focus:outline-none"
          />
        ))}
      </div>

      {error && <p className="text-error text-sm text-center">{error}</p>}

      <Button type="submit" fullWidth size="lg" loading={loading} disabled={digits.some((d) => !d)}>
        تأكيد
      </Button>

      <button
        type="button"
        onClick={() => api.post('/auth/otp/request', { phone })}
        className="text-brand-dark text-sm font-bold text-center"
      >
        إعادة إرسال الكود
      </button>
    </form>
  )
}
