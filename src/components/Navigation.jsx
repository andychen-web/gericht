import React, { useEffect } from 'react'
import images from '../data/images'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import { setItems } from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'

const Navigation = () => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.token.token)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const cartUpdate = useSelector((state) => state.cart.cartUpdateCount)

  useEffect(() => {
    const fetchCart = async (token) => {
      try {
        const response = await fetch(
          'https://vue3-course-api.hexschool.io/v2/api/newcart1/admin/products/all',
          {
            headers: { Authorization: token },
            method: 'GET'
          }
        )
        const data = await response.json()
        const newCartItems = []
        for (const key in data.products) {
          newCartItems.push(data.products[key])
        }
        const combinedCartItems = newCartItems.reduce((acc, item) => {
          const existingItem = acc.find((i) => i.title === item.title)
          if (existingItem) {
            existingItem.quantity += item.quantity
          } else {
            acc.push({ ...item })
          }
          return acc
        }, [])
        dispatch(setItems(combinedCartItems))
      } catch (error) {
        console.log(error)
      }
    }
    fetchCart(token)
  }, [cartUpdate])

  return (
    <Navbar
      bg="black"
      expand="lg"
      variant="dark"
      className="position-fixed custom-nav"
    >
      <Container>
        <a href="/" className="custom-brand">
          <img src={images.gericht} alt="logo" width={'40%'} />
        </a>
        {/* 創建一個可collapse的toggle btn，aria-controls代表要控制的Navbar.Collapse的id */}
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-end">
          <Nav>
            <Link className="custom-link nav-link" to="/">
              首頁
            </Link>
            <Link className="custom-link nav-link" to="/products">
              產品列表
            </Link>
            <Link className="custom-link nav-link" to="/cart">
              購物車
              <span className="badge badge-danger">
                {cartItems.length === 0 ? null : cartItems.length}
              </span>
            </Link>
            <Link className="custom-link nav-link" to="/orders">
              訂單查詢
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
