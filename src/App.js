import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/custom.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Products from './pages/frontend/Products'
import UserAuth from './pages/frontend/UserAuth'
import AdminAuth from './pages/backend/AdminAuth'
import Product from './pages/frontend/Product'
import Cart from './pages/frontend/Cart'
import Checkout from './pages/frontend/Checkout'
import Home from './pages/frontend/Home'
import AdminOrders from './pages/backend/AdminOrders'
import Favorites from './pages/frontend/Favorites'
import Order from './components/Order'
import { useDispatch, useSelector } from 'react-redux'
import Navigation from './components/Navigation'
import PickupMethods from './pages/frontend/PickupMethods'
import Footer from './components/Footer'
import { setUserToken } from './slices/tokenSlice'
import AdminProducts from './pages/backend/AdminProducts'

function App() {
  const dispatch = useDispatch()
  const orders = useSelector((state) => state.orderForm.completedOrders)
  const products = useSelector((state) => state.product.productArray)
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
          {orders?.length > 0 &&
            orders.map((order) => (
              <Route
                key={order._id}
                path={`${order._id}`}
                element={<Order order={order} />}
              />
            ))}
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/userAuth" element={<UserAuth />} />
        <Route path="/adminAuth" element={<AdminAuth />} />
        <Route path="/pickupMethods" element={<PickupMethods />} />
        {products?.length > 0 &&
          products.map((product) => (
            <Route
              key={product.id}
              path={`product/${product.id}`}
              element={<Product product={product} />}
            />
          ))}
      </Routes>
      <Footer />
    </>
  )
}
export default App
