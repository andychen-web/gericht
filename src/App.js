import React, { useEffect } from 'react'
import './assets/stylesheets/all.scss'
import { Navigate, Route, Routes } from 'react-router-dom'
import Products from './pages/frontend/ProductsPage/Products'
import UserAuth from './pages/frontend/AuthPage/UserAuth'
import AdminAuth from './pages/backend/AdminAuth'
import Product from './pages/frontend/ProductPage/Product'
import Cart from './pages/frontend/CartPage/Cart'
import Checkout from './pages/frontend/CheckOutPage/Checkout'
import Home from './pages/frontend/HomePage/Home'
import AdminOrders from './pages/backend/AdminOrders'
import Favorites from './pages/frontend/FavoritesPage/Favorites'
import Order from './components/Order'
import { useDispatch, useSelector } from 'react-redux'
import Navigation from './components/Navigation'
import PickupMethods from './pages/frontend/PickupMethodsPage/PickupMethods'
import Footer from './components/Footer'
import { setUserToken } from './slices/tokenSlice'
import AdminProducts from './pages/backend/AdminProducts'

function App() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.token.token)
  const adminToken = useSelector((state) => state.token.adminToken)
  const currentUser = useSelector((state) => state.user.currentUser)

  // auto log out after token expires
  useEffect(() => {
    if (token) {
      if (Math.floor(Date.now() / 1000) > currentUser.exp) {
        dispatch(setUserToken(null))
      }
    }
  }, [token])

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route
          path="/admin"
          element={adminToken ? null : <Navigate to="/adminAuth" replace />}
        >
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders/:id" element={<Order />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/userAuth" element={<UserAuth />} />
        <Route path="/adminAuth" element={<AdminAuth />} />
        <Route path="/pickupMethods" element={<PickupMethods />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
      <Footer />
    </>
  )
}
export default App
