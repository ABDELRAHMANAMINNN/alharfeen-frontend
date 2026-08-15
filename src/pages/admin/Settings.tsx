import { useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToastStore } from '@/hooks/useToast'

const sections = ['عام', 'السوق', 'الدفع', 'التوصيل', 'الإشعارات', 'المستخدمون والصلاحيات']

export default function Settings() {
  const [active, setActive] = useState(sections[0])
  const push = useToastStore((s) => s.push)

  return (
    <div>
      <AdminPageHeader title="الإعدادات" />

      <div className="flex gap-6">
        <aside className="w-56 shrink-0 flex flex-col gap-1">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`text-sm font-bold rounded-control px-3 py-2 text-right ${active === s ? 'bg-brand/10 text-brand-dark' : 'text-ink hover:bg-surface'}`}
            >
              {s}
            </button>
          ))}
        </aside>

        <div className="flex-1 bg-white border border-border rounded-card p-6 flex flex-col gap-4 max-w-lg">
          <p className="font-extrabold text-ink text-base text-right">{active}</p>
          {active === 'عام' && (
            <>
              <Input label="اسم المنصة" defaultValue="الحرفيين" />
              <Input label="البريد الإلكتروني للدعم" defaultValue="support@alharafyeen.com" />
            </>
          )}
          {active === 'السوق' && <Input label="نسبة عمولة المنصة %" defaultValue="8" type="number" />}
          {active === 'الدفع' && <Input label="طرق الدفع المفعّلة" defaultValue="الدفع عند الاستلام، بطاقة ائتمان" />}
          {active === 'التوصيل' && <Input label="رسوم التوصيل الأساسية" defaultValue="60" type="number" />}
          {active === 'الإشعارات' && <Input label="بريد استقبال تنبيهات النظام" defaultValue="alerts@alharafyeen.com" />}
          {active === 'المستخدمون والصلاحيات' && <Input label="عدد المستخدمين الإداريين" defaultValue="3" disabled />}
          <Button className="self-start" onClick={() => push('تم حفظ الإعدادات')}>حفظ التغييرات</Button>
        </div>
      </div>
    </div>
  )
}
