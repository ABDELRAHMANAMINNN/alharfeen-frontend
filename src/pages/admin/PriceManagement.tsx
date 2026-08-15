import { useEffect, useMemo, useState, useCallback } from 'react'
import { Search, Percent } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/EmptyState'
import { api } from '@/services/api'
import { useToastStore } from '@/hooks/useToast'
import type { ApiProduct } from '@/services/catalog'

export default function PriceManagement() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [percent, setPercent] = useState('')
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const push = useToastStore((s) => s.push)

  const load = useCallback(() => {
    setLoading(true)
    api.get<{ items: ApiProduct[] }>('/admin/products?pageSize=200').then((res) => setProducts(res.items.filter((p) => !p.archived))).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(
    () => products.filter((p) => p.name.includes(query) || p.partNumber.toLowerCase().includes(query.toLowerCase())),
    [products, query]
  )

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id))

  const applyBulk = async () => {
    const n = Number(percent)
    if (!n || selected.length === 0) return
    await api.post('/admin/products/bulk-price', { productIds: selected, percent: n })
    push(`تم تعديل سعر ${selected.length} منتج بنسبة ${n}%`)
    setSelected([])
    setPercent('')
    load()
  }

  const commitDraft = async (id: string) => {
    const val = Number(drafts[id])
    if (!val) return
    await api.patch(`/admin/products/${id}/price`, { price: val })
    push('تم تحديث السعر')
    setDrafts((d) => {
      const next = { ...d }
      delete next[id]
      return next
    })
    load()
  }

  return (
    <div>
      <AdminPageHeader title="إدارة الأسعار" subtitle="عدّل الأسعار فرديًا أو بالجملة" />

      <div className="bg-white border border-border rounded-card p-4 flex items-center gap-3 mb-4">
        <Button size="sm" disabled={!percent || selected.length === 0} onClick={applyBulk}>
          تطبيق على {selected.length} منتج
        </Button>
        <div className="w-40">
          <Input placeholder="نسبة % مثال: 10 أو -10" icon={<Percent className="size-4" />} value={percent} onChange={(e) => setPercent(e.target.value)} />
        </div>
        <p className="text-muted text-xs mr-auto">حدد المنتجات ثم أدخل نسبة التغيير (موجبة للزيادة، سالبة للخصم)</p>
      </div>

      <div className="w-72 mb-4">
        <Input placeholder="ابحث بالاسم أو رقم القطعة..." icon={<Search className="size-4" />} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex flex-col gap-2"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
      ) : (
        <div className="bg-white border border-border rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs border-b border-border">
                <th className="text-right font-bold px-4 py-2"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
                <th className="text-right font-bold px-4 py-2">المنتج</th>
                <th className="text-right font-bold px-4 py-2">السعر الحالي</th>
                <th className="text-right font-bold px-4 py-2">سعر جديد</th>
                <th className="text-right font-bold px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} /></td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-bold text-ink">{p.name}</p>
                    <p className="text-muted text-xs">{p.partNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-muted">{p.price.toLocaleString('ar-EG')} ج.م</td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      placeholder={String(p.price)}
                      value={drafts[p.id] ?? ''}
                      onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                      className="w-28 h-9 rounded-control border border-border px-2 text-sm text-right focus:border-brand focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {drafts[p.id] && (
                      <Button size="sm" variant="secondary" onClick={() => commitDraft(p.id)}>حفظ</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
