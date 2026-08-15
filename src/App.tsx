import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useCartStore } from '@/hooks/useCartStore'
import CustomerLayout from '@/layouts/CustomerLayout'
import AdminLayout from '@/layouts/AdminLayout'
import AuthLayout from '@/layouts/AuthLayout'
import Home from '@/pages/customer/Home'
import Search from '@/pages/customer/Search'
import Categories from '@/pages/customer/Categories'
import CategoryDetail from '@/pages/customer/CategoryDetail'
import VehicleSelection from '@/pages/customer/VehicleSelection'
import ProductListing from '@/pages/customer/ProductListing'
import ProductDetails from '@/pages/customer/ProductDetails'
import PriceComparison from '@/pages/customer/PriceComparison'
import SellerProfile from '@/pages/customer/SellerProfile'
import Favorites from '@/pages/customer/Favorites'
import Cart from '@/pages/customer/Cart'
import Checkout from '@/pages/customer/Checkout'
import OrderConfirmation from '@/pages/customer/OrderConfirmation'
import Orders from '@/pages/customer/Orders'
import OrderDetail from '@/pages/customer/OrderDetail'
import Notifications from '@/pages/customer/Notifications'
import Profile from '@/pages/customer/Profile'
import Dashboard from '@/pages/admin/Dashboard'
import AdminProducts from '@/pages/admin/Products'
import PriceManagement from '@/pages/admin/PriceManagement'
import AdminPromotions from '@/pages/admin/Promotions'
import AdminSellers from '@/pages/admin/Sellers'
import AdminOrders from '@/pages/admin/Orders'
import Inventory from '@/pages/admin/Inventory'
import CategoriesVehicles from '@/pages/admin/CategoriesVehicles'
import Analytics from '@/pages/admin/Analytics'
import AdminSettings from '@/pages/admin/Settings'
import Splash from '@/pages/auth/Splash'
import Onboarding from '@/pages/auth/Onboarding'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import Otp from '@/pages/auth/Otp'
import ResetPassword from '@/pages/auth/ResetPassword'
import Placeholder from '@/pages/Placeholder'

function AdminGuard() {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/home" replace />
  return <Outlet />
}

function App() {
  const user = useAuthStore((s) => s.user)
  const fetchCart = useCartStore((s) => s.fetch)
  const resetCart = useCartStore((s) => s.reset)

  useEffect(() => {
    if (user && user.role === 'CUSTOMER') fetchCart()
    else resetCart()
  }, [user, fetchCart, resetCart])

  return (
    <Routes>
      <Route path="/" element={<Splash />} />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Customer */}
      <Route element={<CustomerLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryDetail />} />
        <Route path="/vehicles" element={<VehicleSelection />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/products/:slug/compare" element={<PriceComparison />} />
        <Route path="/sellers/:id" element={<SellerProfile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/vehicles" element={<Placeholder title="سياراتي المحفوظة" />} />
        <Route path="/profile/addresses" element={<Placeholder title="عناويني" />} />
        <Route path="/profile/settings" element={<Placeholder title="الإعدادات" />} />
        <Route path="/help" element={<Placeholder title="المساعدة" />} />
        <Route path="/about" element={<Placeholder title="عن الحرفيين" />} />
      </Route>

      {/* Admin */}
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/:id" element={<Placeholder title="تفاصيل المنتج" />} />
          <Route path="/admin/pricing" element={<PriceManagement />} />
          <Route path="/admin/promotions" element={<AdminPromotions />} />
          <Route path="/admin/sellers" element={<AdminSellers />} />
          <Route path="/admin/sellers/:id" element={<Placeholder title="تفاصيل البائع" />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<Placeholder title="تفاصيل الطلب" />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/categories" element={<CategoriesVehicles />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default App
