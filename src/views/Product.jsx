import React, { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Footer from '../components/Footer'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Product = ({ product, products }) => {
  Product.propTypes = {
    product: PropTypes.object,
    products: PropTypes.array
  }
  const [showAddAlert, setShowAddAlert] = useState(false)
  const [showUpdateAlert, setShowUpdateAlert] = useState(false)
  const token = useSelector((state) => state.token.token)
  const [updateCount, setUpdateCount] = useState(0)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()
  let alertMessage

  const relatedProducts = products.filter(
    (item) => item.category === product.category
  )
  const uniqueRelatedProducts = relatedProducts.filter(
    (item) => item.id !== product.id
  )

  const handleAddAlert = () => {
    setShowAddAlert(!showAddAlert)
  }
  const handleUpdateAlert = () => {
    setShowUpdateAlert(!showUpdateAlert)
  }
  useEffect(() => {
    alertMessage = document.querySelector('.add-cart-alert')
    if (showAddAlert) {
      alertMessage.classList.remove('hidden')
      setTimeout(() => {
        setShowAddAlert(false)
      }, 2000)
    } else {
      alertMessage.classList.add('hidden')
    }
  }, [showAddAlert])
  useEffect(() => {
    alertMessage = document.querySelector('.update-cart-alert')
    if (showUpdateAlert) {
      alertMessage.classList.remove('hidden')
      setTimeout(() => {
        setShowUpdateAlert(false)
      }, 2000)
    } else {
      alertMessage.classList.add('hidden')
    }
  }, [showUpdateAlert])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [product])

  useEffect(() => {
    const blurDivs = document.querySelectorAll('.blur-load')
    blurDivs.forEach((div) => {
      const img = div.querySelector('img')

      function loaded () {
        div.classList.add('loaded')
      }

      if (img.complete) {
        loaded()
      } else {
        img.addEventListener('load', loaded)
      }
    })
  }, [])

  const addToCart = async (product) => {
    const duplicate = cartItems.filter(
      (item) => item.title === product.title
    )[0]
    if (duplicate) {
      try {
        const response = await fetch(
          `https://vue3-course-api.hexschool.io/v2/api/newcart1/admin/product/${duplicate.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token
            },
            body: JSON.stringify({
              data: {
                title: product.title,
                origin_price: product.origin_price,
                price: product.price,
                unit: product.unit,
                quantity: duplicate.quantity + 1,
                category: product.category,
                imageUrl: product.image
              }
            })
          }
        )
        const data = await response.json()
        setUpdateCount((prevState) => prevState + 1)
        if (data.success) {
          handleUpdateAlert()
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const response = await fetch(
          'https://vue3-course-api.hexschool.io/v2/api/newcart1/admin/product',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token
            },
            body: JSON.stringify({
              data: {
                title: product.title,
                origin_price: product.origin_price,
                price: product.price,
                unit: product.unit,
                quantity: product.quantity,
                category: product.category,
                imageUrl: product.image
              }
            })
          }
        )
        const data = await response.json()
        setUpdateCount((prevState) => prevState + 1)
        if (data.success) {
          handleAddAlert()
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="bg">
      <Navigation updateCount={updateCount} />
      <div className=" position-fixed custom-top end-0 me-2">
        <div className="add-cart-alert alert alert-light mt-5 hidden">
          已加入購物車
          <button
            type="button"
            aria-label="close"
            className="close border-0"
            style={{ background: '#fefefe' }}
            onClick={() => handleAddAlert()}
          >
            x
          </button>
        </div>
        <div className="update-cart-alert alert alert-light hidden">
          已更新購物車
          <button
            type="button"
            aria-label="close"
            className="close border-0"
            style={{ background: '#fefefe' }}
            onClick={() => handleUpdateAlert()}
          >
            x
          </button>
        </div>
      </div>
      <Container className="custom-padding-top">
        <Row>
          <Col
            xs={12}
            md={8}
            lg={8}
            className="product-img-wrap blur-load rounded"
          >
            <img
              src={product.image}
              className="product-img rounded obj-contain"
              alt={product.title}
            />
          </Col>
          <Col
            xs={6}
            md={3}
            lg={3}
            className="product-card h-75 text-dark mt-3 py-3 bg-beige rounded d-flex flex-column"
          >
            <h4>{product.title}</h4>
            <div className="custom-small-font">【Gericht季節特選】</div>
            <div className="pt-3">
              <s> 原價 {product.origin_price}</s>
            </div>
            <div>
              <span className="text-danger fw-bold h5">
                特價 NT${product.price}
              </span>
            </div>
            <div className="d-flex">
              <div className="btn-group bg-white">
                <button
                  onClick={() =>
                    setQuantity((prevState) =>
                      prevState > 1 ? prevState - 1 : prevState
                    )
                  }
                  type="button"
                  className="btn btn-outline-secondary text-dark"
                >
                  -
                </button>
                <button
                  disabled="disabled"
                  className="btn btn-outline-secondary text-dark"
                >
                  {quantity}
                </button>
                <button
                  onClick={() => setQuantity((prevState) => prevState + 1)}
                  type="button"
                  className="btn btn-outline-secondary"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                addToCart(product)
              }}
              className="custom-btn my-3"
            >
              加入購物車
            </button>
          </Col>
        </Row>
        <Col md={9} lg={7} className="text-left mt-3 m-auto">
          <pre className="custom-small-font bg-beige px-5 py-3 rounded">
            <h5>商品描述</h5>
            {product.description}
            <p className="text-muted">***溫馨提醒：所有產品須冷藏***</p>
          </pre>
        </Col>
        <Col md={9} lg={7} className="text-left mt-3 m-auto">
          <div className="bg-beige px-5 py-3 rounded">
            <h5> 類似商品</h5>
            <Row>
              {uniqueRelatedProducts &&
                uniqueRelatedProducts.map((product) => (
                  <Col
                    key={product.id}
                    md={4}
                    xs={4}
                    className="mb-4 blur-load"
                  >
                    <img
                      width={'95%'}
                      className="rounded cursor-pointer"
                      src={product.image}
                      alt={product.title}
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                    <p className="">{product.title}</p>
                  </Col>
                ))}
            </Row>
          </div>
        </Col>
      </Container>
      <Footer />
    </div>
  )
}

export default Product
