import { useLocation, useNavigate, Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = (location.state as { orderId?: string } | null)?.orderId

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-20 gap-4">
      <div className="bg-success/10 text-success p-5 rounded-full">
        <CheckCircle2 className="size-12" />
      </div>
      <h1 className="font-extrabold text-ink text-xl">تم تأكيد طلبك بنجاح</h1>
      {orderId && <p className="text-muted text-sm">رقم الطلب: <span className="font-bold text-ink">{orderId}</span></p>}
      <p className="text-muted text-sm max-w-xs">هنبعتلك تحديثات أول بأول عن حالة الطلب لحد ما يوصلك.</p>
      <div className="flex flex-col gap-2.5 w-full max-w-xs mt-4">
        <Button fullWidth onClick={() => navigate('/orders')}>تتبع الطلب</Button>
        <Link to="/home" className="text-brand-dark text-sm font-bold text-center">العودة للرئيسية</Link>
      </div>
    </div>
  )
}
