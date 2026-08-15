import { useEffect, useState, useCallback } from 'react'
import { Search, ShieldCheck, Ban, CheckCircle2, Plus, X } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/EmptyState'
import { api } from '@/services/api'
import { useToastStore } from '@/hooks/useToast'

type AdminSeller = {
  id: string
  name: string
  verified: boolean
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING'
  rating: number
  reviewCount: number
  location: string
  responseRate: number
}

const statusTone = {
  ACTIVE: 'success',
  SUSPENDED: 'error',
  PENDING: 'warning',
} as const

const statusLabel = {
  ACTIVE: 'نشط',
  SUSPENDED: 'موقوف',
  PENDING: 'بانتظار التوثيق',
} as const

export default function AdminSellers() {
  const [sellers, setSellers] = useState<AdminSeller[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [adding, setAdding] = useState(false)

  const [newSeller, setNewSeller] = useState({
    name: '',
    location: '',
  })

  const push = useToastStore((s) => s.push)

  const load = useCallback(() => {
    setLoading(true)

    api
      .get<AdminSeller[]>('/sellers')
      .then(setSellers)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const setStatus = async (
    id: string,
    status: AdminSeller['status'],
    name: string
  ) => {
    await api.patch(`/admin/sellers/${id}/status`, { status })

    push(
      status === 'ACTIVE'
        ? `تم تفعيل ${name}`
        : status === 'SUSPENDED'
          ? `تم إيقاف ${name}`
          : `تم تحديث حالة ${name}`
    )

    load()
  }

  const handleAddSeller = async () => {
    if (!newSeller.name.trim() || !newSeller.location.trim()) {
      push('من فضلك أدخل اسم البائع والموقع')
      return
    }

    try {
      setAdding(true)

      await api.post('/admin/sellers', {
        name: newSeller.name.trim(),
        location: newSeller.location.trim(),
      })

      push(`تم إضافة البائع ${newSeller.name}`)

      setNewSeller({
        name: '',
        location: '',
      })

      setShowAddModal(false)
      load()
    } finally {
      setAdding(false)
    }
  }

  const filtered = sellers.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <AdminPageHeader
        title="البائعون"
        subtitle={`${sellers.length} بائع مسجّل`}
        action={
          <Button
            size="sm"
            icon={<Plus className="size-4" />}
            onClick={() => setShowAddModal(true)}
          >
            إضافة بائع
          </Button>
        }
      />

      <div className="w-72 mb-4">
        <Input
          placeholder="ابحث باسم البائع..."
          icon={<Search className="size-4" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : (
        <div className="bg-white border border-border rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs border-b border-border">
                <th className="text-right font-bold px-4 py-2">البائع</th>
                <th className="text-right font-bold px-4 py-2">الموقع</th>
                <th className="text-right font-bold px-4 py-2">التقييم</th>
                <th className="text-right font-bold px-4 py-2">الحالة</th>
                <th className="text-right font-bold px-4 py-2">إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="font-bold text-ink">{s.name}</span>

                      {s.verified && (
                        <ShieldCheck className="size-3.5 text-success" />
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right text-muted">
                    {s.location}
                  </td>

                  <td className="px-4 py-3 text-right text-muted">
                    {s.rating} ({s.reviewCount})
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Badge tone={statusTone[s.status]}>
                      {statusLabel[s.status]}
                    </Badge>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {s.status === 'PENDING' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={<CheckCircle2 className="size-3.5" />}
                          onClick={() =>
                            setStatus(s.id, 'ACTIVE', s.name)
                          }
                        >
                          توثيق
                        </Button>
                      )}

                      {s.status !== 'SUSPENDED' ? (
                        <Button
                          size="sm"
                          variant="danger"
                          icon={<Ban className="size-3.5" />}
                          onClick={() =>
                            setStatus(s.id, 'SUSPENDED', s.name)
                          }
                        >
                          إيقاف
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            setStatus(s.id, 'ACTIVE', s.name)
                          }
                        >
                          تفعيل
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-10 text-center text-muted">
              لا يوجد بائعون
            </div>
          )}
        </div>
      )}

      {/* Add Seller Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            className="w-full max-w-md bg-white rounded-card shadow-xl"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-lg font-extrabold text-ink">
                  إضافة بائع جديد
                </h2>

                <p className="text-sm text-muted mt-1">
                  أضف بيانات البائع إلى المنصة
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4">
              <Input
                label="اسم البائع"
                placeholder="مثال: شركة النور لقطع الغيار"
                value={newSeller.name}
                onChange={(e) =>
                  setNewSeller((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />

              <Input
                label="الموقع"
                placeholder="مثال: أسوان"
                value={newSeller.location}
                onChange={(e) =>
                  setNewSeller((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 p-5 border-t border-border">
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => setShowAddModal(false)}
                disabled={adding}
              >
                إلغاء
              </Button>

              <Button
                className="flex-1"
                onClick={handleAddSeller}
                disabled={adding}
              >
                {adding ? 'جاري الإضافة...' : 'إضافة البائع'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}