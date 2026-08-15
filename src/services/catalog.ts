import { useEffect, useState, useCallback } from 'react'
import { api, ApiClientError } from './api'
import type { Category, Seller, Product, ProductOffer } from '@/types'

type ApiSeller = Seller & { status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING' }
type ApiCategory = Category & { slug?: string }
export type ApiProduct = Product & { stock: number; archived: boolean }

function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    fetcher()
      .then((result) => setData(result))
      .catch((e) => setError(e instanceof ApiClientError ? e.message : 'تعذّر تحميل البيانات'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

export function useCategories() {
  return useFetch<ApiCategory[]>(() => api.get('/categories'), [])
}

export function useSellers() {
  return useFetch<ApiSeller[]>(() => api.get('/sellers'), [])
}

export function useSeller(id: string | undefined) {
  return useFetch<ApiSeller & { productCount: number }>(() => api.get(`/sellers/${id}`), [id])
}

export function useSellerProducts(id: string | undefined) {
  return useFetch<{ items: ApiProduct[] }>(() => api.get(`/sellers/${id}/products`), [id])
}

export type ProductListParams = {
  q?: string
  categoryId?: string
  sellerId?: string
  sort?: 'popular' | 'price-asc' | 'price-desc' | 'rating'
}

function toQueryString(params: ProductListParams) {
  const sp = new URLSearchParams()
  if (params.q) sp.set('q', params.q)
  if (params.categoryId) sp.set('categoryId', params.categoryId)
  if (params.sellerId) sp.set('sellerId', params.sellerId)
  if (params.sort) sp.set('sort', params.sort)
  sp.set('pageSize', '50')
  return sp.toString()
}

export function useProducts(params: ProductListParams) {
  return useFetch<{ items: ApiProduct[]; total: number }>(
    () => api.get(`/products?${toQueryString(params)}`),
    [params.q, params.categoryId, params.sellerId, params.sort]
  )
}

export function useProduct(slug: string | undefined) {
  return useFetch<ApiProduct>(() => api.get(`/products/${slug}`), [slug])
}

export function useRelatedProducts(slug: string | undefined) {
  return useFetch<ApiProduct[]>(() => api.get(`/products/${slug}/related`), [slug])
}

export function useOffers(slug: string | undefined) {
  return useFetch<ProductOffer[]>(() => api.get(`/products/${slug}/offers`), [slug])
}
