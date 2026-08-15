import { useEffect, useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import Input from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/EmptyState'
import { api } from '@/services/api'
import type { ApiProduct } from '@/services/catalog'

export default function Inventory() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    api.get<{ items: ApiProduct[] }>('/admin/products?pageSize=200').then((res) => setProducts(res.items)).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const updateStock = async (id: string, stock: number) => {
    await api.patch(`/admin/products/${id}/stock`, { stock })
    load()
  }

  const filtered = products.filter((p) => p.name.includes(query) || p.partNumber.toLowerCase().includes(query.toLowerCase()))
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const outOfStock = products.filter((p) => p.stock === 0).length

  return (
    <div>
      <AdminPageHeader title="المخزون" subtitle={`${lowStock} منتج بمخزون منخفض · ${outOfStock} نفذ من المخزون`} />

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
                <th className="text-right font-bold px-4 py-2">المنتج</th>
                <th className="text-right font-bold px-4 py-2">SKU</th>
                <th className="text-right font-bold px-4 py-2">البائع</th>
                <th className="text-right font-bold px-4 py-2">الحالة</th>
                <th className="text-right font-bold px-4 py-2">تحديث المخزون</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-right font-bold text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-right text-muted">{p.partNumber}</td>
                  <td className="px-4 py-3 text-right text-muted">{p.sellerName}</td>
                  <td className="px-4 py-3 text-right">
                    {p.stock === 0 ? (
                      <Badge tone="error">نفذ من المخزون</Badge>
                    ) : p.stock <= 5 ? (
                      <Badge tone="warning">مخزون منخفض ({p.stock})</Badge>
                    ) : (
                      <Badge tone="success">متوفر ({p.stock})</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      defaultValue={p.stock}
                      onBlur={(e) => updateStock(p.id, Number(e.target.value))}
                      className="w-20 h-9 rounded-control border border-border px-2 text-sm text-right focus:border-brand focus:outline-none"
                    />
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
