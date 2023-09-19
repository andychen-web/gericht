import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/custom.css'
import { Route, Routes } from 'react-router-dom'
import Products from './views/Products'
import Product from './views/Product'
import Cart from './views/Cart'
import Checkout from './views/Checkout'
import Home from './views/Home'
import Orders from './views/Orders'
import Favorites from './views/Favorites'
import Order from './components/Order'
import { useDispatch, useSelector } from 'react-redux'
import { setToken } from './slices/tokenSlice'
import Navigation from './components/Navigation'

function App() {
  const dispatch = useDispatch()
  const orders = useSelector((state) => state.orderForm.orderArray)
  const products = useSelector((state) => state.product.productArray)

  useEffect(() => {
    // 先登入測試帳號取得token，取得後續POST request權限
    const signIn = async () => {
      try {
        const response = await fetch(
          'https://vue3-course-api.hexschool.io/v2/admin/signin',
          {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: 'newandy1@gmail.com',
              password: `${process.env.REACT_APP_PASSWORD}`
            })
          }
        )
        const data = await response.json()
        authorize(data.token)
        dispatch(setToken(data.token))
      } catch (error) {
        console.error(error)
      }
    }

    const authorize = async (token) => {
      try {
        await fetch('https://vue3-course-api.hexschool.io/v2/api/user/check', {
          method: 'POST',
          headers: { Authorization: token }
        })
      } catch (error) {
        console.log(error)
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/products`,
          { method: 'GET' }
        )
        // eslint-disable-next-line no-unused-vars
        const data = await response.json()
      } catch (error) {
        console.log(error)
      }
    }
    signIn()
    fetchProducts()
  }, [])

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products products={products} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/favorites" element={<Favorites />} />
        {orders &&
          orders.map((order) => (
            <Route
              key={order.id}
              path={`/order/${order.id}`}
              element={<Order order={order} />}
            />
          ))}
        {products &&
          products.map((product) => (
            <Route
              key={product.id}
              path={`product/${product.id}`}
              element={<Product products={products} product={product} />}
            />
          ))}
      </Routes>
    </>
  )
}
export default App
