import { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/EmptyState'
import { api } from '@/services/api'
import { useToastStore } from '@/hooks/useToast'

type ApiPromotion = {
  id: string
  title: string
  discountPercent: number
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED'
}

const statusTone = { ACTIVE: 'success', SCHEDULED: 'info', EXPIRED: 'neutral' } as const
const statusLabel = { ACTIVE: 'نشط', SCHEDULED: 'مجدول', EXPIRED: 'منتهي' } as const

export default function Promotions() {
  const [promotions, setPromotions] = useState<ApiPromotion[]>([])
  const [loading, setLoading] = useState(true)
  const push = useToastStore((s) => s.push)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [discount, setDiscount] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    api.get<ApiPromotion[]>('/promotions').then(setPromotions).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const create = async () => {
    if (!title || !discount) return
    await api.post('/admin/promotions', {
      title,
      discountPercent: Number(discount),
      startDate: start || new Date().toISOString().slice(0, 10),
      endDate: end || new Date().toISOString().slice(0, 10),
    })
    push('تم إنشاء العرض')
    setOpen(false)
    setTitle('')
    setDiscount('')
    setStart('')
    setEnd('')
    load()
  }

  const remove = async (id: string) => {
    await api.delete(`/admin/promotions/${id}`)
    load()
  }

  return (
    <div>
      <AdminPageHeader title="العروض" subtitle={`${promotions.length} عرض`} action={<Button size="sm" icon={<Plus className="size-4" />} onClick={() => setOpen(true)}>عرض جديد</Button>} />

      {loading ? (
        <div className="grid grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {promotions.map((p) => (
            <div key={p.id} className="bg-white border border-border rounded-card p-4 flex flex-col gap-2 text-right">
              <div className="flex items-center justify-between">
                <button onClick={() => remove(p.id)} className="text-muted hover:text-error"><Trash2 className="size-4" /></button>
                <Badge tone={statusTone[p.status]}>{statusLabel[p.status]}</Badge>
              </div>
              <p className="font-extrabold text-ink">{p.title}</p>
              <p className="text-brand-dark font-bold text-2xl">{p.discountPercent}%</p>
              <p className="text-muted text-xs">{p.startDate.slice(0, 10)} — {p.endDate.slice(0, 10)}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="إنشاء عرض جديد">
        <div className="flex flex-col gap-3">
          <Input label="اسم العرض" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input label="نسبة الخصم %" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="تاريخ البداية" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            <Input label="تاريخ النهاية" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <Button fullWidth onClick={create}>إنشاء</Button>
        </div>
      </Modal>
    </div>
  )
}
