import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Car, ShieldCheck } from 'lucide-react'
import Button from '@/components/ui/Button'

const steps = [
  {
    icon: Search,
    title: 'دوّر على أي قطعة غيار',
    body: 'ابحث بالاسم أو رقم القطعة أو موديل عربيتك، واحصل على نتائج دقيقة فورًا.',
  },
  {
    icon: Car,
    title: 'تأكد من التوافق مع عربيتك',
    body: 'اختر سيارتك مرة واحدة، وهنعرض لك بس القطع المتوافقة معاها.',
  },
  {
    icon: ShieldCheck,
    title: 'قارن الأسعار من بائعين موثّقين',
    body: 'شوف أسعار أكتر من بائع في مكان واحد واختار الأنسب لك بثقة.',
  },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const { icon: Icon, title, body } = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div className="flex flex-col h-full min-h-[70vh]">
      <button
        className="self-start text-muted text-sm font-bold mb-6"
        onClick={() => navigate('/login')}
      >
        تخطي
      </button>

      <div className="flex-1 flex flex-col items-center text-center gap-5 justify-center">
        <div className="bg-brand/10 text-brand-dark p-6 rounded-full">
          <Icon className="size-10" />
        </div>
        <h1 className="font-extrabold text-ink text-xl">{title}</h1>
        <p className="text-muted text-sm max-w-xs">{body}</p>
      </div>

      <div className="flex items-center justify-center gap-2 py-6">
        {steps.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-brand' : 'w-1.5 bg-border'}`} />
        ))}
      </div>

      <Button
        fullWidth
        size="lg"
        onClick={() => (isLast ? navigate('/login') : setStep((s) => s + 1))}
      >
        {isLast ? 'ابدأ الآن' : 'التالي'}
      </Button>
    </div>
  )
}
