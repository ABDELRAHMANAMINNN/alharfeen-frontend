import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Truck, CreditCard, Check, ChevronLeft } from 'lucide-react'
import { useCartStore } from '@/hooks/useCartStore'
import { useOrdersStore } from '@/hooks/useOrdersStore'
import { useToastStore } from '@/hooks/useToast'
import { ApiClientError } from '@/services/api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const DELIVERY_FEES = { standard: 60, express: 120 }
const steps = ['العنوان', 'التوصيل', 'الدفع', 'المراجعة']

export default function Checkout() {
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState('')
  const [delivery, setDelivery] = useState<'standard' | 'express'>('standard')
  const [payment, setPayment] = useState<'الدفع عند الاستلام' | 'بطاقة ائتمان'>('الدفع عند الاستلام')
  const [submitting, setSubmitting] = useState(false)
  const { items, subtotal, reset } = useCartStore()
  const createOrder = useOrdersStore((s) => s.createOrder)
  const push = useToastStore((s) => s.push)
  const navigate = useNavigate()

  const fee = DELIVERY_FEES[delivery]
  const total = subtotal + fee
  const canNext = step === 0 ? address.trim().length > 3 : true

  const placeOrder = async () => {
    setSubmitting(true)
    try {
      const order = await createOrder({ address, deliveryMethod: delivery, paymentMethod: payment })
      reset()
      navigate('/order-confirmation', { state: { orderId: order.id } })
    } catch (err) {
      push(err instanceof ApiClientError ? err.message : 'تعذّر إتمام الطلب', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-32 md:px-0 md:pb-6 md:max-w-lg md:mx-auto">
      <div className="flex items-center gap-2 justify-end">
        <h1 className="font-extrabold text-ink text-lg">إتمام الطلب</h1>
        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="text-muted"><ChevronLeft className="size-5" /></button>
        )}
      </div>

      <div className="flex items-center gap-1.5 justify-center">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={`size-2 rounded-full ${i <= step ? 'bg-brand' : 'bg-border'}`} />
            {i < steps.length - 1 && <div className="w-6 h-px bg-border" />}
          </div>
        ))}
      </div>
      <p className="text-center text-xs font-bold text-muted -mt-2">{steps[step]}</p>

      {step === 0 && (
        <Input label="العنوان بالتفصيل" placeholder="مثال: القاهرة، مدينة نصر، شارع مصطفى النحاس" icon={<MapPin className="size-4" />} value={address} onChange={(e) => setAddress(e.target.value)} />
      )}

      {step === 1 && (
        <div className="flex flex-col gap-2.5">
          {(['standard', 'express'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDelivery(d)}
              className={`flex items-center justify-between p-4 rounded-card border text-right ${delivery === d ? 'border-brand bg-brand/5' : 'border-border bg-white'}`}
            >
              {delivery === d && <Check className="size-4 text-brand-dark" />}
              <div>
                <p className="font-bold text-ink text-sm">{d === 'standard' ? 'توصيل عادي (٢-٣ أيام)' : 'توصيل سريع (يوم واحد)'}</p>
                <p className="text-muted text-xs">{DELIVERY_FEES[d]} ج.م</p>
              </div>
              <Truck className="size-5 text-muted" />
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-2.5">
          {(['الدفع عند الاستلام', 'بطاقة ائتمان'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPayment(p)}
              className={`flex items-center justify-between p-4 rounded-card border text-right ${payment === p ? 'border-brand bg-brand/5' : 'border-border bg-white'}`}
            >
              {payment === p && <Check className="size-4 text-brand-dark" />}
              <p className="font-bold text-ink text-sm">{p}</p>
              <CreditCard className="size-5 text-muted" />
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-3">
          <div className="bg-white border border-border rounded-card p-4 flex flex-col gap-2 text-sm text-right">
            <p><span className="text-muted">العنوان: </span><span className="font-bold text-ink">{address}</span></p>
            <p><span className="text-muted">التوصيل: </span><span className="font-bold text-ink">{delivery === 'standard' ? 'عادي' : 'سريع'}</span></p>
            <p><span className="text-muted">الدفع: </span><span className="font-bold text-ink">{payment}</span></p>
          </div>
          <div className="bg-white border border-border rounded-card p-4 flex flex-col gap-1.5">
            <div className="flex justify-between text-sm text-muted"><span>{subtotal.toLocaleString('ar-EG')} ج.م</span><span>المجموع الفرعي</span></div>
            <div className="flex justify-between text-sm text-muted"><span>{fee.toLocaleString('ar-EG')} ج.م</span><span>التوصيل</span></div>
            <div className="flex justify-between font-extrabold text-ink border-t border-border pt-1.5"><span>{total.toLocaleString('ar-EG')} ج.م</span><span>الإجمالي</span></div>
          </div>
        </div>
      )}

      <div className="fixed md:static bottom-0 inset-x-0 max-w-md md:max-w-none mx-auto bg-white border-t md:border-0 border-border p-4 md:p-0 md:mt-2">
        <Button
          fullWidth
          size="lg"
          disabled={!canNext || items.length === 0}
          loading={submitting}
          onClick={() => (step === steps.length - 1 ? placeOrder() : setStep((s) => s + 1))}
        >
          {step === steps.length - 1 ? 'تأكيد الطلب' : 'متابعة'}
        </Button>
      </div>
    </div>
  )
}
