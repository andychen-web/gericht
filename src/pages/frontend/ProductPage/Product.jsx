import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setFavorites } from '../../../slices/favoritesSlice'
import { setCartUpdate } from '../../../slices/cartSlice'
import Loader from '../../../components/Loader'
import Alert from '../../../components/Alert'
import { BsFillCartFill } from 'react-icons/bs'
import { FaRegHeart, FaHeart } from 'react-icons/fa'

const Product = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const products = useSelector((state) => state.product.productArray)
  const [product, setProduct] = useState({})
  const [alertQueue, setAlertQueue] = useState([])
  const token = useSelector((state) => state.token.token)
  const currentUser = useSelector((state) => state.user.currentUser)
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()
  const favorites = useSelector((state) => state.favorite.favoriteList)

  const relatedProducts = products.filter(
    (item) => item.category === product.category && item.id !== product.id
  )
  const handleLike = (product) => {
    dispatch(setFavorites(product))
  }

  const handleAlert = (message) => {
    setAlertQueue((prevQueue) => [...prevQueue, { message }])
  }
  const getProduct = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/product/${id}`,
        { method: 'GET' }
      )
      const data = await response.json()
      setProduct(data.product)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    getProduct()
  }, [])
  const addToCart = async (product, quantity) => {
    if (!token) {
      navigate('/userAuth')
    } else {
      setIsLoading(true)

      const res = await fetch(
        `${process.env.REACT_APP_API}api/${process.env.REACT_APP_CART_PATH}/products`,
        {
          method: 'GET',
          headers: {
            Authorization: token
          }
        }
      )
      const allCartItems = await res.json()
      const userCartItems = allCartItems.products.filter(
        (item) => item.uId === currentUser.id
      )
      const duplicateCartItem =
        userCartItems.length > 0 &&
        userCartItems.find((item) => item.title === product.title)

      if (duplicateCartItem) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API}api/${process.env.REACT_APP_CART_PATH}/product/${duplicateCartItem.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token
              },
              body: JSON.stringify({
                data: {
                  uId: currentUser.id,
                  title: product.title,
                  origin_price: product.origin_price,
                  price: product.price,
                  unit: product.unit,
                  quantity: duplicateCartItem.quantity + quantity,
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
          handleAlert('加入購物車失敗')
        }
      } else {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API}api/${process.env.REACT_APP_CART_PATH}/product`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token
              },
              body: JSON.stringify({
                data: {
                  uId: currentUser.id,
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
          handleAlert('加入購物車失敗')
        }
      }
      setIsLoading(false)
    }
  }
  return (
    <main className="bg">
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
            <h5 className="title-border">商品描述</h5>
            {product.description}
            <p className="text-muted">*溫馨提醒：所有產品須冷藏*</p>
          </pre>
        </Col>
        <Col className="text-left mt-3 m-auto product-info">
          <div className="bg-beige px-5 py-3 rounded">
            <h5 className="title-border"> 類似商品</h5>
            <Row>
              {relatedProducts.length > 0 &&
                relatedProducts.map((product) => (
                  <Col key={product.id} md={4} xs={12} className="mb-4">
                    <img
                      width={'150px'}
                      className="rounded cursor-pointer"
                      src={product.image}
                      alt={product.title}
                      onClick={() => {
                        setProduct(product)
                        navigate(`/product/${product.id}`)
                      }}
                    />
                    <div>{product.title}</div>
                  </Col>
                ))}
            </Row>
          </div>
        </Col>
      </Container>
    </main>
  )
}

export default Product
