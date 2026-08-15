import { create } from 'zustand'
import { api } from '@/services/api'
import type { OrderStatus } from '@/types'

export type ApiOrderItem = { productId: string; name: string; slug: string; quantity: number; price: number }
export type ApiOrder = {
  id: string
  status: OrderStatus
  address: string
  deliveryMethod: string
  paymentMethod: string
  deliveryFee: number
  total: number
  createdAt: string
  updatedAt: string
  items: ApiOrderItem[]
}

interface OrdersState {
  orders: ApiOrder[]
  loading: boolean
  fetch: () => Promise<void>
  createOrder: (input: { address: string; deliveryMethod: 'standard' | 'express'; paymentMethod: string }) => Promise<ApiOrder>
  getOrder: (id: string) => Promise<ApiOrder>
  updateStatus: (id: string, status: OrderStatus) => Promise<void>
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  loading: false,

  fetch: async () => {
    set({ loading: true })
    try {
      const orders = await api.get<ApiOrder[]>('/orders')
      set({ orders, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  createOrder: async (input) => {
    const order = await api.post<ApiOrder>('/orders', input)
    set((s) => ({ orders: [order, ...s.orders] }))
    return order
  },

  getOrder: async (id) => {
    const cached = get().orders.find((o) => o.id === id)
    if (cached) return cached
    return api.get<ApiOrder>(`/orders/${id}`)
  },

  updateStatus: async (id, status) => {
    await api.patch(`/admin/orders/${id}/status`, { status })
    await get().fetch()
  },
}))
