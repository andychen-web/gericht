import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/custom.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Products from './pages/Products'
import Auth from './pages/Auth'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import Orders from './pages/Orders'
import Favorites from './pages/Favorites'
import Order from './components/Order'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from './slices/productSlice'
import Navigation from './components/Navigation'

function App() {
  const dispatch = useDispatch()
  const orders = useSelector((state) => state.orderForm.orderArray)
  const products = useSelector((state) => state.product.productArray)

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/products`,
        { method: 'GET' }
      )
      const data = await response.json()

      dispatch(setProducts(data.products))
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchProducts()
  }, [])
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products products={products} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/auth" element={<Auth />} />
        {orders &&
          orders.map((order) => (
            <Route
              key={order.id}
              path={`/order/${order.serial}`}
              element={<Order order={order} />}
            />
          ))}
        {products &&
          products.map((product) => (
            <Route
              key={product.id}
              path={`product/${product.id}`}
              element={<Product product={product} />}
            />
          ))}
      </Routes>
    </>
  )
}
export default App
