import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import BottomNavigation from '@/components/layout/BottomNavigation'
import DesktopHeader from '@/components/layout/DesktopHeader'
import Footer from '@/components/layout/Footer'
import ToastViewport from '@/components/ui/ToastViewport'

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <div className="md:hidden"><Header /></div>
      <DesktopHeader />

      <main className="flex-1 w-full max-w-md mx-auto md:max-w-7xl md:px-8 md:py-6">
        <Outlet />
      </main>

      <div className="md:hidden"><BottomNavigation /></div>
      <Footer />
      <ToastViewport />
    </div>
  )
}
