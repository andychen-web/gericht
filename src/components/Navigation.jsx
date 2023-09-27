import React, { useEffect, useRef } from 'react'
import images from '../data/images'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import { setCartItems } from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminToken } from '../slices/tokenSlice'
import { Dropdown } from 'react-bootstrap'

const Navigation = () => {
  const dispatch = useDispatch()
  const adminToken = useSelector((state) => state.token.adminToken)
  const token = useSelector((state) => state.token.token)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const cartUpdateCount = useSelector((state) => state.cart.cartUpdateCount)
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
        dispatch(setCartItems(newCartItems))
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
        <a href="/">
          <img src={images.gericht} alt="logo" width={'40%'} />
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
            <Link
              onClick={() => toggleNav()}
              className="custom-link nav-link"
              to="/"
            >
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
            <Link className="custom-link nav-link" to="/favorites">
              我的收藏
            </Link>

            <Dropdown>
              <Dropdown.Toggle id="dropdown-custom-components">
                後台管理
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {adminToken ? (
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      dispatch(setAdminToken(null))
                    }}
                  >
                    登出
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item as={Link} to="/auth">
                    管理員登入
                  </Dropdown.Item>
                )}
                <Dropdown.Item as={Link} to="/orders">
                  訂單查詢
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* toggle menu for  th e  2 below */}
            {/* {adminToken ? (
              <Link
                className="custom-link nav-link"
                onClick={() => {
                  dispatch(setAdminToken(null))
                }}
              >
                登出
              </Link>
            ) : (
              <Link className="custom-link nav-link" to="/auth">
                後台管理登入
              </Link>
            )}
            <Link className="custom-link nav-link" to="/orders">
              訂單查詢
            </Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
