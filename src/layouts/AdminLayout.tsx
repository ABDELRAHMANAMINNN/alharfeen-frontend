import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/layout/AdminSidebar'
import ToastViewport from '@/components/ui/ToastViewport'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-surface">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-x-hidden">
        <Outlet />
      </main>
      <ToastViewport />
    </div>
  )
}
