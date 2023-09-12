import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Footer from '../components/Footer'
import { BsFillCartFill } from 'react-icons/bs'
import PropTypes from 'prop-types'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setCartUpdate } from '../slices/cartSlice'
import CartAlert from '../components/CartAlert'

const Products = ({ products }) => {
  Products.propTypes = {
    products: PropTypes.array
  }
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.token.token)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const [priceRange, setPriceRange] = useState('全部')
  const [category, setCategory] = useState('全部')
  const [alertQueue, setAlertQueue] = useState([])
  const [currentAlert, setCurrentAlert] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const categoryTypes = ['全部', '燉飯', '義大利麵', '烤肉', '甜點']
  const priceRangeArr = ['全部', '$99~$199', '$200~$399']

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

    if (products) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [products])

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
    const updatedProduct = await updatedProducts.products.find(
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

  useEffect(() => {
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
    })
  }, [])
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
          {/* 篩選品項 */}
          <Col md={3} className="custom-max-width">
            <label className="h3 special-text fw-bold">種類</label>
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

            <label className="h3 special-text fw-bold">價格區間</label>
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
          <Col md={9}>
            <Row className="gap-5">
              {filterdProducts &&
                filterdProducts.map((product, key) => (
                  <Col
                    key={key}
                    xs={8}
                    sm={4}
                    lg={3}
                    className="text-white mx-2 mt-3 blur-load rounded"
                  >
                    <img
                      className="menu-products rounded pb-2"
                      src={product.image}
                      alt={product.title}
                    />

                    <div>{product.title}</div>
                    <div className="d-flex">
                      <h5 className="pe-2">${product.price}</h5>
                      <BsFillCartFill
                        size={20}
                        className="custom-icon"
                        onClick={() => {
                          addToCart(product)
                        }}
                      />
                    </div>
                    <button
                      className="custom-btn"
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
