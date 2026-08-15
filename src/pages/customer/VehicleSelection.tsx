import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Plus, Car } from 'lucide-react'
import { useVehicleStore } from '@/hooks/useVehicleStore'
import { useAuthStore } from '@/hooks/useAuthStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useToastStore } from '@/hooks/useToast'
import { EmptyState, Skeleton } from '@/components/ui/EmptyState'

const makes = ['Toyota', 'Nissan', 'Hyundai', 'Chevrolet', 'Kia']

export default function VehicleSelection() {
  const { vehicles, selectedId, loading, fetch, select, addVehicle } = useVehicleStore()
  const user = useAuthStore((s) => s.user)
  const push = useToastStore((s) => s.push)
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [make, setMake] = useState(makes[0])
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')

  useEffect(() => {
    if (user) fetch()
  }, [user, fetch])

  if (!user) {
    return (
      <div className="px-4 pt-4">
        <EmptyState icon={<Car className="size-7" />} title="سجّل الدخول لإدارة سياراتك" actionLabel="تسجيل الدخول" onAction={() => navigate('/login')} />
      </div>
    )
  }

  const onAdd = async () => {
    if (!model || !year) return
    setSaving(true)
    try {
      await addVehicle({ make, model, year: Number(year) })
      push('تمت إضافة السيارة')
      setAdding(false)
      setModel('')
      setYear('')
    } catch {
      push('تعذّرت إضافة السيارة', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
      <h1 className="font-extrabold text-ink text-lg text-right">سياراتي</h1>

      {loading ? (
        <div className="flex flex-col gap-2.5"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {vehicles.map((v) => {
            const active = v.id === selectedId
            return (
              <button
                key={v.id}
                onClick={() => {
                  select(v.id)
                  push(`تم اختيار ${v.make} ${v.model}`)
                  navigate('/home')
                }}
                className={`flex items-center justify-between p-4 rounded-card border text-right ${active ? 'border-brand bg-brand/5' : 'border-border bg-white'}`}
              >
                {active && <Check className="size-5 text-brand-dark" />}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-ink text-sm">{v.make} {v.model}</p>
                    <p className="text-muted text-xs">موديل {v.year}</p>
                  </div>
                  <div className="bg-surface p-2.5 rounded-control">
                    <Car className="size-5" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {adding ? (
        <div className="bg-white border border-border rounded-card p-4 flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-ink mb-1.5 text-right">الماركة</p>
            <select value={make} onChange={(e) => setMake(e.target.value)} className="w-full h-12 rounded-control border border-border px-3 text-sm">
              {makes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <Input label="الموديل" placeholder="مثال: كورولا" value={model} onChange={(e) => setModel(e.target.value)} />
          <Input label="سنة الصنع" type="number" placeholder="مثال: 2018" value={year} onChange={(e) => setYear(e.target.value)} />
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setAdding(false)}>إلغاء</Button>
            <Button fullWidth onClick={onAdd} loading={saving}>حفظ</Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" fullWidth icon={<Plus className="size-4" />} onClick={() => setAdding(true)}>
          إضافة سيارة جديدة
        </Button>
      )}
    </div>
  )
}
