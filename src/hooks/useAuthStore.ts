import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  api,
  getToken,
  setToken,
  ApiClientError,
} from '@/services/api'

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

  googleLogin: (idToken: string) => Promise<AuthUser>

  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      // Get token from localStorage OR sessionStorage
      token: getToken(),

      loading: false,
      error: null,

      register: async (input) => {
        set({
          loading: true,
          error: null,
        })

        try {
          const { user, token } = await api.post<{
            user: AuthUser
            token: string
          }>('/auth/register', input)

          // Registration keeps the user logged in
          setToken(token, true)

          set({
            user,
            token,
            loading: false,
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
        })

        try {
          const { user, token } = await api.post<{
            user: AuthUser
            token: string
          }>('/auth/login', {
            phone,
            password,
          })

          // Respect Remember Me
          setToken(token, rememberMe)

          set({
            user,
            token,
            loading: false,
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

      googleLogin: async (idToken) => {
        set({
          loading: true,
          error: null,
        })

        try {
          const response = await api.post<{
            user?: AuthUser
            token?: string
            isNewUser?: boolean
            needsProfile?: boolean
            google?: {
              providerUserId: string
              email: string
              name: string
            }
          }>('/auth/google', {
            idToken,
          })

          /*
           * A brand-new Google account currently cannot be
           * created automatically because the users table
           * requires a phone number and password.
           *
           * The backend therefore asks the frontend to
           * complete the user's profile first.
           */
          if (response.needsProfile) {
            throw new Error(
              'حساب Google تم التحقق منه. أكمل بيانات حسابك أولاً.'
            )
          }

          if (!response.user || !response.token) {
            throw new Error(
              'استجابة تسجيل الدخول باستخدام Google غير مكتملة'
            )
          }

          // Keep Google users logged in
          setToken(response.token, true)

          set({
            user: response.user,
            token: response.token,
            loading: false,
          })

          return response.user
        } catch (e) {
          const message =
            e instanceof ApiClientError
              ? e.message
              : e instanceof Error
                ? e.message
                : 'تعذّر تسجيل الدخول باستخدام Google'

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
          error: null,
        })
      },

      clearError: () => {
        set({
          error: null,
        })
      },
    }),

    {
      name: 'alharafyeen-auth',

      /*
       * Do NOT save the JWT inside Zustand's persisted state.
       *
       * The JWT is controlled by localStorage/sessionStorage
       * through setToken(), depending on Remember Me.
       */
      partialize: (state) => ({
        user: state.user,
      }),

      onRehydrateStorage: () => (state) => {
        if (state) {
          const token = getToken()

          state.token = token
        }
      },
    }
  )
)