import { create } from 'zustand'
import { api, ApiClientError } from '@/services/api'
import type { ApiProduct } from '@/services/catalog'

interface FavoritesState {
  products: ApiProduct[]
  ids: string[]
  loading: boolean
  fetch: () => Promise<void>
  toggle: (productId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  products: [],
  ids: [],
  loading: false,

  fetch: async () => {
    set({ loading: true })
    try {
      const products = await api.get<ApiProduct[]>('/favorites')
      set({ products, ids: products.map((p) => p.id), loading: false })
    } catch {
      set({ loading: false })
    }
  },

  toggle: async (productId) => {
    // optimistic update
    const wasFavorite = get().ids.includes(productId)
    set((s) => ({ ids: wasFavorite ? s.ids.filter((id) => id !== productId) : [...s.ids, productId] }))
    try {
      await api.post(`/favorites/${productId}/toggle`)
      await get().fetch()
    } catch (e) {
      // revert on failure
      set((s) => ({ ids: wasFavorite ? [...s.ids, productId] : s.ids.filter((id) => id !== productId) }))
      if (e instanceof ApiClientError && e.status === 401) {
        // caller should prompt login; state already reverted
      }
    }
  },

  isFavorite: (productId) => get().ids.includes(productId),
}))
