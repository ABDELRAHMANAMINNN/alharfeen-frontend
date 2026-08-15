import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, setToken, ApiClientError } from '@/services/api'

export type AuthUser = {
  id: string
  name: string
  phone: string
  email: string | null
  role: 'CUSTOMER' | 'ADMIN'
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
  register: (input: { name: string; phone: string; password: string; email?: string }) => Promise<AuthUser>
  login: (phone: string, password: string) => Promise<AuthUser>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      register: async (input) => {
        set({ loading: true, error: null })
        try {
          const { user, token } = await api.post<{ user: AuthUser; token: string }>('/auth/register', input)
          setToken(token)
          set({ user, token, loading: false })
          return user
        } catch (e) {
          const message = e instanceof ApiClientError ? e.message : 'تعذّر إنشاء الحساب'
          set({ loading: false, error: message })
          throw e
        }
      },

      login: async (phone, password) => {
        set({ loading: true, error: null })
        try {
          const { user, token } = await api.post<{ user: AuthUser; token: string }>('/auth/login', { phone, password })
          setToken(token)
          set({ user, token, loading: false })
          return user
        } catch (e) {
          const message = e instanceof ApiClientError ? e.message : 'تعذّر تسجيل الدخول'
          set({ loading: false, error: message })
          throw e
        }
      },

      logout: () => {
        setToken(null)
        set({ user: null, token: null })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'alharafyeen-auth',
      onRehydrateStorage: () => (state) => {
        // Keep the API client's token store in sync with the persisted zustand state on reload
        if (state?.token) setToken(state.token)
      },
    }
  )
)
