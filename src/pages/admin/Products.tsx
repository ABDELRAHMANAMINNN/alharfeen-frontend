import { useEffect, useState, useCallback, useRef } from 'react'
import { Search, Plus, Archive, ArchiveRestore, ImagePlus, X, Package } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/EmptyState'
import { useCategories, useSellers } from '@/services/catalog'
import { api, ApiClientError, uploadImage, getAssetUrl } from '@/services/api'
import { useToastStore } from '@/hooks/useToast'
import type { ApiProduct } from '@/services/catalog'

const emptyForm = {
  name: '', brand: '', partNumber: '', categoryId: '', sellerId: '', compatibility: '', price: '', oldPrice: '', stock: '', description: '', image: '',
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [viewProduct, setViewProduct] = useState<ApiProduct | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: categories } = useCategories()
  const { data: sellers } = useSellers()
  const push = useToastStore((s) => s.push)

  const load = useCallback(() => {
    setLoading(true)
    api.get<{ items: ApiProduct[] }>('/admin/products?pageSize=200').then((res) => setProducts(res.items)).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleArchived = async (p: ApiProduct) => {
    await api.patch(`/admin/products/${p.id}/archive`, { archived: !p.archived })
    push(p.archived ? 'تمت الاستعادة' : 'تمت الأرشفة')
    load()
  }

  const openAdd = () => {
    setForm({
      ...emptyForm,
      categoryId: categories?.[0]?.id ?? '',
      sellerId: sellers?.[0]?.id ?? '',
    })
    setImagePreview('')
    setFormError('')
    setAddOpen(true)
  }

  const onSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show an instant local preview while the real upload is in flight
    const localPreview = URL.createObjectURL(file)
    setImagePreview(localPreview)
    setUploading(true)
    setFormError('')
    try {
      const { url } = await uploadImage(file)
      setForm((f) => ({ ...f, image: url }))
    } catch (err) {
      setFormError(err instanceof ApiClientError ? err.message : 'تعذّر رفع الصورة')
      setImagePreview('')
      setForm((f) => ({ ...f, image: '' }))
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setForm((f) => ({ ...f, image: '' }))
    setImagePreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const submitAdd = async () => {
    setFormError('')
    if (!form.name.trim() || !form.brand.trim() || !form.partNumber.trim() || !form.categoryId || !form.sellerId || !form.compatibility.trim() || !form.price) {
      setFormError('من فضلك املأ كل الحقول المطلوبة')
      return
    }
    if (uploading) {
      setFormError('استنى لحد ما رفع الصورة يخلص')
      return
    }
    setSaving(true)
    try {
      await api.post('/admin/products', {
        name: form.name.trim(),
        brand: form.brand.trim(),
        partNumber: form.partNumber.trim(),
        categoryId: form.categoryId,
        sellerId: form.sellerId,
        compatibility: form.compatibility.trim(),
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        stock: form.stock ? Number(form.stock) : 0,
        image: form.image || undefined,
        description: form.description.trim() || undefined,
      })
      push('تمت إضافة المنتج بنجاح')
      setAddOpen(false)
      load()
    } catch (err) {
      setFormError(err instanceof ApiClientError ? err.message : 'تعذّرت إضافة المنتج')
    } finally {
      setSaving(false)
    }
  }

  const filtered = products.filter(
    (p) => p.archived === showArchived && (p.name.includes(query) || p.partNumber.toLowerCase().includes(query.toLowerCase()))
  )

  const noSellers = (sellers?.length ?? 0) === 0
  const noCategories = (categories?.length ?? 0) === 0

  return (
    <div>
      <AdminPageHeader
        title="المنتجات"
        subtitle={`${products.filter((p) => !p.archived).length} منتج نشط`}
        action={<Button icon={<Plus className="size-4" />} size="sm" onClick={openAdd} disabled={noSellers || noCategories}>إضافة منتج</Button>}
      />

      {(noSellers || noCategories) && (
        <p className="text-warning text-xs font-bold mb-4 text-right">
          {noSellers && 'لا يوجد بائعون مسجّلون بعد — '}
          {noCategories && 'لا توجد فئات بعد — '}
          أضف بيانات البائعين/الفئات في قاعدة البيانات أولًا قبل إضافة منتجات.
        </p>
      )}

      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setShowArchived((v) => !v)} className="text-xs font-bold text-muted">
          {showArchived ? 'عرض المنتجات النشطة' : 'عرض المؤرشفة'}
        </button>
        <div className="w-72">
          <Input placeholder="ابحث بالاسم أو رقم القطعة..." icon={<Search className="size-4" />} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2"><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-muted text-sm text-center py-16">
          {showArchived ? 'لا توجد منتجات مؤرشفة' : 'لا توجد منتجات بعد — ابدأ بإضافة أول منتج'}
        </p>
      ) : (
        <div className="bg-white border border-border rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs border-b border-border">
                <th className="text-right font-bold px-4 py-2"></th>
                <th className="text-right font-bold px-4 py-2">المنتج</th>
                <th className="text-right font-bold px-4 py-2">الفئة</th>
                <th className="text-right font-bold px-4 py-2">البائع</th>
                <th className="text-right font-bold px-4 py-2">السعر</th>
                <th className="text-right font-bold px-4 py-2">المخزون</th>
                <th className="text-right font-bold px-4 py-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="size-10 rounded-control bg-surface flex items-center justify-center overflow-hidden shrink-0">
                      {p.image ? (
                        <img src={getAssetUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="size-4 text-muted" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setViewProduct(p)} className="font-bold text-ink hover:text-brand-dark">{p.name}</button>
                    <p className="text-muted text-xs">{p.partNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-muted">{categories?.find((c) => c.id === p.categoryId)?.name}</td>
                  <td className="px-4 py-3 text-right text-muted">{p.sellerName}</td>
                  <td className="px-4 py-3 text-right font-bold text-ink">{p.price.toLocaleString('ar-EG')} ج.م</td>
                  <td className="px-4 py-3 text-right">
                    <span className={p.stock === 0 ? 'text-error font-bold' : p.stock <= 5 ? 'text-warning font-bold' : 'text-ink'}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleArchived(p)} className="text-muted hover:text-ink" aria-label="أرشفة">
                      {p.archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!viewProduct} onClose={() => setViewProduct(null)} title={viewProduct?.name}>
        {viewProduct && (
          <div className="flex flex-col gap-3 text-sm text-right">
            {viewProduct.image && (
              <img src={getAssetUrl(viewProduct.image)} alt={viewProduct.name} className="w-full h-40 object-cover rounded-control border border-border" />
            )}
            <p><span className="text-muted">رقم القطعة: </span><span className="font-bold text-ink">{viewProduct.partNumber}</span></p>
            <p><span className="text-muted">التوافق: </span><span className="font-bold text-ink">{viewProduct.compatibility}</span></p>
            <p><span className="text-muted">السعر: </span><span className="font-bold text-ink">{viewProduct.price.toLocaleString('ar-EG')} ج.م</span></p>
            <p><span className="text-muted">المخزون: </span><span className="font-bold text-ink">{viewProduct.stock}</span></p>
            {viewProduct.description && <p><span className="text-muted">الوصف: </span><span className="font-bold text-ink">{viewProduct.description}</span></p>}
          </div>
        )}
      </Modal>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="إضافة منتج جديد">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-ink mb-1.5 text-right">صورة المنتج</p>
            {imagePreview || form.image ? (
              <div className="relative w-full h-40 rounded-control overflow-hidden border border-border">
                <img src={imagePreview || getAssetUrl(form.image)} alt="معاينة المنتج" className="w-full h-full object-cover" />
                {uploading && (
                  <div className="absolute inset-0 bg-ink/50 flex items-center justify-center text-white text-xs font-bold">
                    جاري الرفع...
                  </div>
                )}
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 left-2 bg-white p-1.5 rounded-full shadow"
                  aria-label="إزالة الصورة"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 rounded-control border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted hover:border-brand hover:text-brand-dark transition-colors"
              >
                <ImagePlus className="size-6" />
                <span className="text-xs font-bold">اضغط لرفع صورة المنتج</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelectImage} className="hidden" />
          </div>

          <Input label="اسم المنتج" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="الماركة" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
            <Input label="رقم القطعة" value={form.partNumber} onChange={(e) => setForm((f) => ({ ...f, partNumber: e.target.value }))} />
          </div>

          <div>
            <p className="text-sm font-bold text-ink mb-1.5 text-right">الفئة</p>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full h-12 rounded-control border border-border px-3 text-sm"
            >
              {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <p className="text-sm font-bold text-ink mb-1.5 text-right">البائع</p>
            <select
              value={form.sellerId}
              onChange={(e) => setForm((f) => ({ ...f, sellerId: e.target.value }))}
              className="w-full h-12 rounded-control border border-border px-3 text-sm"
            >
              {sellers?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <Input label="التوافق (مثال: متوافق مع كورولا ٢٠١٠–٢٠١٥)" value={form.compatibility} onChange={(e) => setForm((f) => ({ ...f, compatibility: e.target.value }))} />

          <div className="grid grid-cols-3 gap-3">
            <Input label="السعر" type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            <Input label="السعر قبل الخصم" type="number" value={form.oldPrice} onChange={(e) => setForm((f) => ({ ...f, oldPrice: e.target.value }))} />
            <Input label="المخزون" type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
          </div>

          <Input label="الوصف (اختياري)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />

          {formError && <p className="text-error text-sm text-right">{formError}</p>}

          <Button fullWidth loading={saving} disabled={uploading} onClick={submitAdd}>إضافة المنتج</Button>
        </div>
      </Modal>
    </div>
  )
}
