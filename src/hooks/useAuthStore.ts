import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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
  rememberMe: boolean

  register: (input: {
    name: string
    phone: string
    password: string
    email?: string
  }) => Promise<AuthUser>

  login: (
    phone: string,
    password: string,
    rememberMe: boolean
  ) => Promise<AuthUser>

  logout: () => void
  clearError: () => void
}

const authStorage = {
  getItem: (name: string) => {
    return (
      localStorage.getItem(name) ??
      sessionStorage.getItem(name)
    )
  },

  setItem: (name: string, value: string) => {
    try {
      const parsed = JSON.parse(value)
      const rememberMe =
        parsed?.state?.rememberMe === true

      if (rememberMe) {
        localStorage.setItem(name, value)
        sessionStorage.removeItem(name)
      } else {
        sessionStorage.setItem(name, value)
        localStorage.removeItem(name)
      }
    } catch {
      sessionStorage.setItem(name, value)
    }
  },

  removeItem: (name: string) => {
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}

const storage = createJSONStorage(() => authStorage)

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      rememberMe: false,

      register: async (input) => {
        set({
          loading: true,
          error: null,
        })

        try {
          const { user, token } =
            await api.post<{
              user: AuthUser
              token: string
            }>('/auth/register', input)

          // New accounts are remembered by default.
          setToken(token, true)

          set({
            user,
            token,
            loading: false,
            rememberMe: true,
          })

          return user
        } catch (e) {
          const message =
            e instanceof ApiClientError
              ? e.message
              : 'تعذّر إنشاء الحساب'

          set({
            loading: false,
            error: message,
          })

          throw e
        }
      },

      login: async (
        phone,
        password,
        rememberMe
      ) => {
        set({
          loading: true,
          error: null,
          rememberMe,
        })

        try {
          const { user, token } =
            await api.post<{
              user: AuthUser
              token: string
            }>('/auth/login', {
              phone,
              password,
            })

          // This is the important part:
          // the checkbox decides where the token is stored.
          setToken(token, rememberMe)

          set({
            user,
            token,
            loading: false,
            rememberMe,
          })

          return user
        } catch (e) {
          const message =
            e instanceof ApiClientError
              ? e.message
              : 'تعذّر تسجيل الدخول'

          set({
            loading: false,
            error: message,
          })

          throw e
        }
      },

      logout: () => {
        setToken(null)

        set({
          user: null,
          token: null,
          rememberMe: false,
        })
      },

      clearError: () => {
        set({ error: null })
      },
    }),

    {
      name: 'alharafyeen-auth',
      storage,

      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setToken(
            state.token,
            state.rememberMe
          )
        }
      },
    }
  )
)