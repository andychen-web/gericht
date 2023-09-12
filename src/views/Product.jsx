import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Footer from '../components/Footer'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setCartUpdate } from '../slices/cartSlice'
import Loader from '../components/Loader'
import CartAlert from '../components/CartAlert'

const Product = ({ product, products }) => {
  Product.propTypes = {
    product: PropTypes.object,
    products: PropTypes.array
  }
  const dispatch = useDispatch()

  const [alertQueue, setAlertQueue] = useState([])
  const [currentAlert, setCurrentAlert] = useState(null)
  const token = useSelector((state) => state.token.token)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()

  const relatedProducts = products.filter(
    (item) => item.category === product.category
  )
  const uniqueRelatedProducts = relatedProducts.filter(
    (item) => item.id !== product.id
  )

  const handleAddAlert = () => {
    setAlertQueue((prevQueue) => [...prevQueue, { message: '已新增至購物車' }])
    setTimeout(() => {
      setCurrentAlert(null)
    }, 2000)
  }
  const handleUpdateAlert = () => {
    setAlertQueue((prevQueue) => [...prevQueue, { message: '已更新購物車' }])
    setTimeout(() => {
      setCurrentAlert(null)
    }, 2000)
  }
  useEffect(() => {
    if (!currentAlert && alertQueue.length > 0) {
      setCurrentAlert(alertQueue[0])
      // 回傳一個新的array，包括所有從index 1往後的所有值，把他設定新的alert queue
      setAlertQueue((prevQueue) => prevQueue.slice(1))
    }
  }, [currentAlert, alertQueue])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [product])

  const addToCart = async (product) => {
    let duplicate
    const res = await fetch(
      'https://vue3-course-api.hexschool.io/v2/api/newcart1/admin/products',
      {
        method: 'GET',
        headers: {
          Authorization: token
        }
      }
    )
    const updatedProducts = await res.json()
    // const updatedProductsLength = updatedProducts.products.length
    const updatedProduct = updatedProducts.products.find(
      (item) => item.title === product.title
    )
    if (updatedProduct) {
      duplicate = { ...updatedProduct }
    } else if (cartItems) {
      duplicate = cartItems.find((item) => item.title === product.title)
    }

    if (duplicate) {
      setIsLoading(true)
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
        if (data.success) {
          handleUpdateAlert()
          dispatch(setCartUpdate(1))
        }
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    } else {
      setIsLoading(true)
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
        if (data.success) {
          handleAddAlert()
          dispatch(setCartUpdate(1))
        }
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="bg">
      <Loader isLoading={isLoading} />

      {currentAlert && (
        <CartAlert
          message={currentAlert.message}
          onClose={() => setCurrentAlert(null)}
        />
      )}
      <Container className="custom-padding-top">
        <Row>
          <Col xs={12} md={8} lg={8} className="product-img-wrap rounded">
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
                  <Col key={product.id} md={4} xs={4} className="mb-4">
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
