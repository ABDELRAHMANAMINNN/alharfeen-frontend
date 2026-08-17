import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
} from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/hooks/useAuthStore'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = useAuthStore((s) => s.login)
  const googleLogin = useAuthStore((s) => s.googleLogin)

  const navigate = useNavigate()

  const onGoogleSuccess = async (credentialResponse: {
    credential?: string
  }) => {
    setError('')
    setLoading(true)

    try {
      if (!credentialResponse.credential) {
        throw new Error('لم يتم استلام بيانات Google')
      }

      const user = await googleLogin(
        credentialResponse.credential
      )

      navigate(
        user.role === 'ADMIN'
          ? '/admin'
          : '/home'
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'تعذّر تسجيل الدخول باستخدام Google'
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const user = await login(
        phone,
        password,
        rememberMe
      )

      navigate(
        user.role === 'ADMIN'
          ? '/admin'
          : '/home'
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'تعذّر تسجيل الدخول'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <div className="text-right">
        <h1 className="font-extrabold text-ink text-xl">
          أهلاً بيك تاني
        </h1>

        <p className="text-muted text-sm mt-1">
          سجّل دخولك عشان تكمل التسوق
        </p>
      </div>

      {/* Phone */}
      <Input
        label="رقم الموبايل"
        type="tel"
        placeholder="01xxxxxxxxx"
        icon={<Phone className="size-4" />}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      {/* Password */}
      <Input
        label="كلمة المرور"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        icon={<Lock className="size-4" />}
        trailingIcon={
          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
            }
            className="flex items-center justify-center hover:text-brand-dark transition-colors"
            aria-label={
              showPassword
                ? 'إخفاء كلمة المرور'
                : 'إظهار كلمة المرور'
            }
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        }
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error || undefined}
        required
      />

      {/* Remember / Forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) =>
              setRememberMe(e.target.checked)
            }
            className="size-4 accent-brand"
          />

          تذكرني
        </label>

        <Link
          to="/forgot-password"
          className="text-brand-dark text-sm font-bold"
        >
          نسيت كلمة المرور؟
        </Link>
      </div>

      {/* Normal Login */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={loading}
      >
        تسجيل الدخول
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />

        <span className="text-xs text-muted">
          
        </span>

        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Google Login */}
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={() => {
            setError(
              'تعذّر تسجيل الدخول باستخدام Google'
            )
          }}
          useOneTap={false}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%"
        />
      </div>

      {/* Register */}
      <p className="text-center text-sm text-muted">
        مستخدم جديد؟{' '}

        <Link
          to="/register"
          className="text-brand-dark font-bold"
        >
          أنشئ حساب
        </Link>
      </p>
    </form>
  )
}