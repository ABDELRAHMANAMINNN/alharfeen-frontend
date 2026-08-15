import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/services/api'
import type { Vehicle } from '@/types'

interface VehicleState {
  vehicles: Vehicle[]
  selectedId: string | null
  loading: boolean
  fetch: () => Promise<void>
  select: (id: string) => void
  addVehicle: (v: { make: string; model: string; year: number; engine?: string }) => Promise<void>
  removeVehicle: (id: string) => Promise<void>
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      vehicles: [],
      selectedId: null,
      loading: false,

      fetch: async () => {
        set({ loading: true })
        try {
          const vehicles = await api.get<Vehicle[]>('/vehicles')
          set((s) => ({
            vehicles,
            loading: false,
            selectedId: s.selectedId && vehicles.some((v) => v.id === s.selectedId) ? s.selectedId : (vehicles[0]?.id ?? null),
          }))
        } catch {
          set({ loading: false })
        }
      },

      select: (id) => set({ selectedId: id }),

      addVehicle: async (v) => {
        const vehicle = await api.post<Vehicle>('/vehicles', v)
        set((s) => ({ vehicles: [...s.vehicles, vehicle], selectedId: vehicle.id }))
      },

      removeVehicle: async (id) => {
        await api.delete(`/vehicles/${id}`)
        set((s) => {
          const vehicles = s.vehicles.filter((v) => v.id !== id)
          return { vehicles, selectedId: s.selectedId === id ? (vehicles[0]?.id ?? null) : s.selectedId }
        })
      },
    }),
    { name: 'alharafyeen-vehicle-selection', partialize: (s) => ({ selectedId: s.selectedId }) as VehicleState }
  )
)
