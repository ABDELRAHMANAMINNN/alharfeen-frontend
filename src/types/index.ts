export type Vehicle = {
  id: string
  make: string
  model: string
  year: number
  engine?: string
}

export type Seller = {
  id: string
  name: string
  verified: boolean
  status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING'
  rating: number
  reviewCount: number
  location: string
  responseRate: number
  productCount: number
}

export type Category = {
  id: string
  slug?: string
  name: string
  icon: string
}

export type Product = {
  id: string
  slug: string
  name: string
  brand: string
  partNumber: string
  categoryId: string
  compatibility: string
  price: number
  oldPrice?: number
  image: string
  sellerId: string
  sellerName?: string
  sellerVerified?: boolean
  rating: number
  reviewCount: number
  inStock: boolean
  stock?: number
  archived?: boolean
  deliveryEstimate: string
  description: string
  specs: Record<string, string>
}

export type ProductOffer = {
  id?: string
  sellerId: string
  sellerName?: string
  sellerVerified?: boolean
  sellerRating?: number
  price: number
  condition: 'جديد' | 'أصلي' | 'مجدد'
  inStock: boolean
  deliveryEstimate: string
  warranty?: string
}

export type CartItem = {
  productId: string
  quantity: number
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export type OrderItem = {
  productId: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  createdAt: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  address: string
  paymentMethod: string
}

export type Promotion = {
  id: string
  title: string
  discountPercent: number
  startDate: string
  endDate: string
  status: 'active' | 'scheduled' | 'expired'
  productIds: string[]
}

export type Customer = {
  id: string
  name: string
  phone: string
  email: string
}
