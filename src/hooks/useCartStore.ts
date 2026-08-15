import { create } from 'zustand'
import { api } from '@/services/api'

export type ApiCartItem = {
  productId: string
  slug: string
  name: string
  price: number
  oldPrice?: number
  quantity: number
  sellerId: string
  inStock: boolean
}

type CartResponse = { items: ApiCartItem[]; subtotal: number }

interface CartState {
  items: ApiCartItem[]
  subtotal: number
  loading: boolean
  fetch: () => Promise<void>
  add: (productId: string, quantity?: number) => Promise<void>
  setQuantity: (productId: string, quantity: number) => Promise<void>
  remove: (productId: string) => Promise<void>
  reset: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  loading: false,

  fetch: async () => {
    set({ loading: true })
    try {
      const cart = await api.get<CartResponse>('/cart')
      set({ items: cart.items, subtotal: cart.subtotal, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  add: async (productId, quantity = 1) => {
    const cart = await api.post<CartResponse>('/cart/items', { productId, quantity })
    set({ items: cart.items, subtotal: cart.subtotal })
  },

  setQuantity: async (productId, quantity) => {
    const cart = await api.patch<CartResponse>(`/cart/items/${productId}`, { quantity })
    set({ items: cart.items, subtotal: cart.subtotal })
  },

  remove: async (productId) => {
    const cart = await api.delete<CartResponse>(`/cart/items/${productId}`)
    set({ items: cart.items, subtotal: cart.subtotal })
  },

  reset: () => set({ items: [], subtotal: 0 }),
}))
