import React, { useEffect } from 'react'
import images from '../data/images'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import {
  setCartItems,
  setDeliveryLocation,
  setTakeoutInfo
} from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminToken, setUserToken } from '../slices/tokenSlice'
import { NavDropdown } from 'react-bootstrap'
import { cleanFavorites } from '../slices/favoritesSlice'

const Navigation = () => {
  const dispatch = useDispatch()
  const adminToken = useSelector((state) => state.token.adminToken)
  const token = useSelector((state) => state.token.token)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const cartUpdateCount = useSelector((state) => state.cart.cartUpdateCount)
  const currentUser = useSelector((state) => state.user.currentUser)

  useEffect(() => {
    const getCart = async (token) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}api/${process.env.REACT_APP_CART_PATH}/products/all`,
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
        const matchedCartItems = newCartItems.filter(
          (item) => item.uId === currentUser.id
        )
        dispatch(setCartItems(matchedCartItems))
      } catch (error) {
        console.log(error)
      }
    }

    if (token) {
      getCart(token)
    }
  }, [cartUpdateCount])

  return (
    <Navbar
      collapseOnSelect
      bg="black"
      expand="lg"
      variant="dark"
      className="position-fixed custom-nav"
    >
      <Container>
        <a href="/" className="w-50">
          <img src={images.gericht} alt="logo" width={'100px'} />
        </a>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav>
            <Nav.Link className="custom-link nav-link" href="/">
              首頁
            </Nav.Link>
            <Nav.Link className="custom-link nav-link" href="/products">
              美味菜單
            </Nav.Link>
            {adminToken ? null : (
              <>
                <Nav.Link className="custom-link nav-link" href="/cart">
                  結帳
                  {token && (
                    <span className="badge badge-danger">
                      {cartItems.length === 0 ? null : cartItems.length}
                    </span>
                  )}
                </Nav.Link>
                <Nav.Link className="custom-link nav-link" href="/favorites">
                  我的收藏
                </Nav.Link>
                {token ? (
                  <Nav.Link
                    onClick={() => {
                      dispatch(setUserToken(null))
                      dispatch(setCartItems([]))
                      dispatch(cleanFavorites([]))
                      dispatch(setTakeoutInfo(null))
                      dispatch(setDeliveryLocation(null))
                    }}
                    className="custom-link nav-link"
                  >
                    會員登出
                  </Nav.Link>
                ) : (
                  !adminToken && (
                    <Nav.Link className="custom-link nav-link" href="/userAuth">
                      會員登入
                    </Nav.Link>
                  )
                )}
              </>
            )}
            <NavDropdown
              variant="light"
              title={<span className="text-white">後台管理</span>}
            >
              {adminToken ? (
                <>
                  <NavDropdown.Item
                    variant="light"
                    onClick={() => {
                      dispatch(setAdminToken(null))
                    }}
                    href="/products"
                  >
                    管理員登出
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/admin/orders">
                    訂單管理
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/admin/products">
                    商品管理
                  </NavDropdown.Item>
                </>
              ) : (
                <NavDropdown.Item href="/adminAuth">
                  管理員登入
                </NavDropdown.Item>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
