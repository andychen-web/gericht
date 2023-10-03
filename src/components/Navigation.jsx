import React, { useEffect, useRef } from 'react'
import images from '../data/images'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import { setCartItems } from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminToken, setUserToken } from '../slices/tokenSlice'
import { Dropdown } from 'react-bootstrap'
import { cleanFavorites } from '../slices/favoritesSlice'

const Navigation = () => {
  const dispatch = useDispatch()
  const adminToken = useSelector((state) => state.token.adminToken)
  const token = useSelector((state) => state.token.token)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const cartUpdateCount = useSelector((state) => state.cart.cartUpdateCount)
  const currentUser = useSelector((state) => state.user.currentUser)
  const navButton = useRef(null)
  const linksContainerRef = useRef(null)

  function toggleNav() {
    navButton.current.classList.toggle('collapsed')
    linksContainerRef.current.classList.toggle('show')
  }

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
        const matchedCartItems = newCartItems.filter(
          (item) => item.uId === currentUser.id
        )
        dispatch(setCartItems(matchedCartItems))
      } catch (error) {
        console.log(error)
      }
    }

    if (token) {
      fetchCart(token)
    }
  }, [cartUpdateCount])

  return (
    <Navbar
      bg="black"
      expand="lg"
      variant="dark"
      className="position-fixed custom-nav"
    >
      <Container>
        <a href="/" className="w-50">
          <img src={images.gericht} alt="logo" width={'100px'} />
        </a>
        <button
          onClick={() => toggleNav()}
          ref={navButton}
          className="navbar-toggler"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Navbar.Collapse
          ref={linksContainerRef}
          className="justify-content-end"
        >
          <Nav>
            {adminToken ? null : (
              <>
                <Link
                  onClick={() => toggleNav()}
                  className="custom-link nav-link"
                  to="/"
                >
                  首頁
                </Link>
                <Link
                  onClick={() => toggleNav()}
                  className="custom-link nav-link"
                  to="/products"
                >
                  產品列表
                </Link>
                <Link
                  onClick={() => toggleNav()}
                  className="custom-link nav-link"
                  to="/cart"
                >
                  購物車
                  {token && (
                    <span className="badge badge-danger">
                      {cartItems.length === 0 ? null : cartItems.length}
                    </span>
                  )}
                </Link>
                <Link
                  onClick={() => toggleNav()}
                  className="custom-link nav-link"
                  to="/favorites"
                >
                  我的收藏
                </Link>
              </>
            )}

            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-custom-components"
                className="ps-0 pt-2"
              >
                帳號管理
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {adminToken ? (
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      toggleNav()
                      dispatch(setAdminToken(null))
                    }}
                  >
                    管理員登出
                  </Dropdown.Item>
                ) : (
                  !token && (
                    <Dropdown.Item
                      onClick={() => toggleNav()}
                      as={Link}
                      to="/adminAuth"
                    >
                      管理員登入
                    </Dropdown.Item>
                  )
                )}
                {token ? (
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      toggleNav()
                      dispatch(setUserToken(null))
                      dispatch(setCartItems([]))
                      dispatch(cleanFavorites([]))
                    }}
                  >
                    會員登出
                  </Dropdown.Item>
                ) : (
                  !adminToken && (
                    <Dropdown.Item
                      onClick={() => toggleNav()}
                      as={Link}
                      to="/userAuth"
                    >
                      會員登入
                    </Dropdown.Item>
                  )
                )}
                <Dropdown.Item
                  onClick={() => toggleNav()}
                  as={Link}
                  to="/orders"
                >
                  訂單查詢
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
