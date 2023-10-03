import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Footer from '../components/Footer'
import { BsFillCartFill } from 'react-icons/bs'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setCartUpdate } from '../slices/cartSlice'
import { setFavorites } from '../slices/favoritesSlice'
import Alert from '../components/Alert'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
const Products = () => {
  const products = useSelector((state) => state.product.productArray)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.token.token)
  const currentUser = useSelector((state) => state.user.currentUser)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const [priceRange, setPriceRange] = useState('全部')
  const [category, setCategory] = useState('全部')
  const [alertQueue, setAlertQueue] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const categoryTypes = ['全部', '燉飯', '義大利麵', '烤肉', '甜點']
  const priceRangeArr = ['全部', '$99~$199', '$200~$399']
  const favorites = useSelector((state) => state.favorite.favoriteList)
  const handleLike = (product) => {
    if (!token) {
      navigate('/userAuth')
    } else {
      dispatch(setFavorites(product))
    }
  }

  const handleAlert = (message) => {
    setAlertQueue((prevQueue) => [...prevQueue, { message }])
  }

  const handlePriceRangeChange = (e) => {
    const priceDivs = document.querySelectorAll('.price-range')
    priceDivs.forEach((div) => div.classList.remove('clicked'))
    setPriceRange(e.target.innerHTML)
    e.target.classList.add('clicked')
  }
  const handleCategoryChange = (e) => {
    const categoryDivs = document.querySelectorAll('.category')
    categoryDivs.forEach((div) => div.classList.remove('clicked'))
    setCategory(e.target.innerHTML)
    e.target.classList.add('clicked')
  }

  const filterdProducts =
    products &&
    products.filter((product) => {
      let priceMatch = false
      if (priceRange === '全部') {
        priceMatch = true
      } else if (priceRange === '$99~$199') {
        priceMatch = product.price >= 99 && product.price <= 199
      } else if (priceRange === '$200~$399') {
        priceMatch = product.price >= 200 && product.price <= 399
      }

      let categoryMatch = false
      if (category === '全部') {
        categoryMatch = true
      } else if (category === '燉飯') {
        categoryMatch = product.category === '燉飯'
      } else if (category === '義大利麵') {
        categoryMatch = product.category === '義大利麵'
      } else if (category === '烤肉') {
        categoryMatch = product.category === '烤肉'
      } else if (category === '甜點') {
        categoryMatch = product.category === '甜點'
      }

      // return products that match both filters
      return priceMatch && categoryMatch
    })

  const addToCart = async (product) => {
    if (!token) {
      navigate('/userAuth')
    } else {
      setIsLoading(true)

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
      const allCartItems = await res.json()
      const userCartItems = allCartItems.products.filter(
        (item) => item.uId === currentUser.id
      )
      const updatedCartItem =
        userCartItems.length > 0 &&
        userCartItems.find((item) => item.title === product.title)

      if (updatedCartItem) {
        duplicate = { ...updatedCartItem }
      } else if (cartItems) {
        duplicate = cartItems.find((item) => item.title === product.title)
      }

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
                  uId: currentUser.id,
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
            handleAlert('已更新購物車')
          }
        } catch (error) {
          handleAlert('加入購物車失敗')
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
                  uId: currentUser.id,
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
  useEffect(() => {
    if (products.length > 0) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [products])

  useEffect(() => {
    window.scrollTo(0, 0)
    const blurDivs = document.querySelectorAll('.blur-load')
    blurDivs.forEach((div) => {
      const img = div.querySelector('img')

      function loaded() {
        div.classList.add('loaded')
      }
      if (img.complete) {
        loaded()
      } else {
        img.addEventListener('load', loaded)
      }

      return () => {
        img.removeEventListener('load', loaded)
      }
    })
  }, [])
  return (
    <div className="bg">
      <Loader isLoading={isLoading} />

      <Alert alertQueue={alertQueue} setAlertQueue={setAlertQueue} />
      <Container className="custom-padding-top custom-padding-bottom">
        <Row>
          {/* 篩選品項 */}
          <Col md={2} className="filter-max-width text-center">
            <label className="h4 special-text fw-bold">種類</label>
            <ul className="category-wrap bg-dark list-unstyled border">
              {categoryTypes.map((categoryType, key) => (
                <li key={key}>
                  <div
                    className="category text-center ps-2 py-1 py-lg-2 cursor-pointer"
                    onClick={(event) => handleCategoryChange(event)}
                  >
                    {categoryType}
                  </div>
                </li>
              ))}
            </ul>

            <label className="h4 special-text fw-bold">價格區間</label>
            <ul className="bg-dark list-unstyled border">
              {priceRangeArr.map((priceRange, key) => (
                <li key={key}>
                  <div
                    className="price-range text-center ps-2 py-1 py-lg-2 cursor-pointer"
                    onClick={(event) => handlePriceRangeChange(event)}
                  >
                    {priceRange}
                  </div>
                </li>
              ))}
            </ul>
          </Col>
          {/* 展示品項 */}
          <Col md={10}>
            <Row className="gap-3">
              {filterdProducts &&
                filterdProducts.map((product, key) => (
                  <Col
                    key={key}
                    xs={8}
                    md={4}
                    lg={3}
                    className="text-white mx-2 mt-3 blur-load rounded"
                  >
                    <div
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="position-relative product-img-wrap overflow-hidden"
                    >
                      <img
                        className="menu-products rounded pb-2"
                        src={product.image}
                        alt={product.title}
                      />
                      <div className="check-detail">詳細資訊</div>
                    </div>

                    <div>{product.title}</div>
                    <h4 className="pe-2">NT$ {product.price}</h4>
                    <div className="btn-group w-100">
                      <button
                        type="button"
                        onClick={() => {
                          handleLike(product)
                          if (
                            favorites.find((fav) => fav.title === product.title)
                          ) {
                            handleAlert('已從收藏清單刪除')
                          } else {
                            handleAlert('已加入收藏清單')
                          }
                        }}
                        className="btn btn-favorite"
                      >
                        {favorites.find(
                          (fav) => fav.title === product.title
                        ) ? (
                          <FaHeart />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>
                      <button
                        className="btn btn-cart"
                        onClick={() => {
                          addToCart(product)
                        }}
                      >
                        <BsFillCartFill size={20} />
                      </button>
                    </div>
                    <button
                      className="custom-btn mt-2"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      查看更多
                    </button>
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  )
}

export default Products
