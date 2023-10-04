import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Footer from '../components/Footer'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setFavorites } from '../slices/favoritesSlice'
import { setCartUpdate } from '../slices/cartSlice'
import Loader from '../components/Loader'
import Alert from '../components/Alert'
import { BsFillCartFill } from 'react-icons/bs'
import { FaRegHeart, FaHeart } from 'react-icons/fa'

const Product = ({ product }) => {
  Product.propTypes = {
    product: PropTypes.object
  }
  const products = useSelector((state) => state.product.productArray)
  const dispatch = useDispatch()
  const [alertQueue, setAlertQueue] = useState([])
  const token = useSelector((state) => state.token.token)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()
  const favorites = useSelector((state) => state.favorite.favoriteList)

  const relatedProducts = products.filter(
    (item) => item.category === product.category
  )
  const uniqueRelatedProducts = relatedProducts.filter(
    (item) => item.id !== product.id
  )
  const handleLike = (product) => {
    dispatch(setFavorites(product))
  }

  const handleAlert = (message) => {
    setAlertQueue((prevQueue) => [...prevQueue, { message }])
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [product])

  const addToCart = async (product, quantity) => {
    setIsLoading(true)
    let duplicate
    const res = await fetch(
      `${process.env.REACT_APP_API}api/newcart1/admin/products`,
      {
        method: 'GET',
        headers: {
          Authorization: token
        }
      }
    )
    const updatedProducts = await res.json()
    const updatedProduct = updatedProducts.products.find(
      (item) => item.title === product.title
    )
    if (updatedProduct) {
      duplicate = { ...updatedProduct }
    } else if (cartItems) {
      duplicate = cartItems.find((item) => item.title === product.title)
    }

    if (duplicate) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}api/newcart1/admin/product/${duplicate.id}`,
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
                quantity: duplicate.quantity + quantity,
                category: product.category,
                imageUrl: product.image
              }
            })
          }
        )
        const data = await response.json()
        if (data.success) {
          handleAlert('已更新購物車')
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}api/newcart1/admin/product`,
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
                quantity,
                category: product.category,
                imageUrl: product.image
              }
            })
          }
        )
        const data = await response.json()
        if (data.success) {
          handleAlert('已新增至購物車')
          dispatch(setCartUpdate(1))
        }
      } catch (error) {
        console.log(error)
      }
    }
    setIsLoading(false)
  }

  return (
    <div className="bg">
      {<Alert alertQueue={alertQueue} setAlertQueue={setAlertQueue} />}
      <Loader isLoading={isLoading} />
      <Container className="custom-padding-top">
        <Row
          id={'productWrap'}
          className="m-auto d-flex bg-beige product product-wrap rounded"
        >
          <Col
            className="product-img position-left"
            style={{
              backgroundImage: `url(${product.image})`
            }}
          />
          <Col className="product-card h-75 text-dark mt-4 bg-beige rounded d-flex flex-column pb-3">
            <h5 className="fw-bold">{product.title}</h5>
            <div className="custom-small-font">【Gericht季節特選】</div>
            <div className="pt-3">
              <span className="text-muted">
                <s> 原價 {product.origin_price}</s>
              </span>
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
                  className="btn btn-outline-secondary "
                >
                  +
                </button>
              </div>
            </div>
            <div className="btn-group w-100 mt-2">
              <button
                type="button"
                onClick={() => {
                  handleLike(product)
                  if (favorites.find((fav) => fav.title === product.title)) {
                    handleAlert('已從收藏清單刪除')
                  } else {
                    handleAlert('已加入收藏清單')
                  }
                }}
                className="btn btn-favorite"
              >
                {favorites.find((fav) => fav.title === product.title) ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
              </button>
              <button
                className="btn btn-cart"
                onClick={() => {
                  addToCart(product, quantity)
                }}
              >
                <BsFillCartFill size={20} />
              </button>
            </div>
          </Col>
        </Row>
        <Col className="text-left mt-3 m-auto product-info">
          <pre className="custom-small-font bg-beige px-5 py-3 rounded">
            <h5>商品描述</h5>
            {product.description}
            <p className="text-muted">***溫馨提醒：所有產品須冷藏***</p>
          </pre>
        </Col>
        <Col className="text-left mt-3 m-auto product-info">
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
                    <p>{product.title}</p>
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
