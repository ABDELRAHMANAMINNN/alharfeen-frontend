import { Outlet } from 'react-router-dom'
import Logo from '@/components/ui/Logo'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center md:py-10">
      <div className="w-full max-w-md min-h-screen md:min-h-0 md:rounded-[24px] md:overflow-hidden bg-ink flex flex-col justify-between md:shadow-2xl">
        <div className="pt-16 pb-8 flex justify-center">
          <Logo size={44} theme="dark" />
        </div>
        <div className="bg-white rounded-t-[32px] flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
