import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BsFillCartFill } from 'react-icons/bs'
import Loader from '../../../components/Loader'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setCartUpdate } from '../../../slices/cartSlice'
import { setFavorites } from '../../../slices/favoritesSlice'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { setProducts } from '../../../slices/productSlice'

const Products = () => {
  const products = useSelector((state) => state.product.productArray)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.token.token)
  const currentUser = useSelector((state) => state.user.currentUser)
  const [priceRange, setPriceRange] = useState('全部')
  const [category, setCategory] = useState('全部')
  const [isLoading, setIsLoading] = useState(false)
  const categoryTypes = ['全部', '燉飯', '義大利麵', '烤肉', '甜點']
  const priceRangeArr = ['全部', '$99~$199', '$200~$399']
  const favorites = useSelector((state) => state.favorite.favoriteList)
  const MySwal = withReactContent(Swal)
  const getProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/products`,
        { method: 'GET' }
      )
      const data = await response.json()
      const availableProducts = data.products.filter(
        (product) => product.category !== '下架'
      )
      dispatch(setProducts(availableProducts))
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getProducts()
  }, [])

  const handleLike = (product) => {
    if (!token) {
      navigate('/userAuth')
    } else {
      dispatch(setFavorites(product))
    }
  }

  const handleAlert = (message) => {
    MySwal.fire({
      title: <p className="fs-4">{message}</p>,
      timer: 1500
    })
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

  const filteredProducts =
    products &&
    products.filter((product) => {
      const isPriceMatch =
        priceRange === '全部' ||
        (priceRange === '$99~$199' &&
          product.price >= 99 &&
          product.price <= 199) ||
        (priceRange === '$200~$399' &&
          product.price >= 200 &&
          product.price <= 399)

      const isCategoryMatch =
        category === '全部' || product.category === category
      return isPriceMatch && isCategoryMatch
    })

  const addToCart = async (product) => {
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
                  quantity: duplicateCartItem.quantity + 1,
                  category: product.category,
                  image: product.image
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
                  quantity: product.quantity,
                  category: product.category,
                  image: product.image
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

      <Container className="custom-padding-top custom-padding-bottom">
        <Row>
          {/* 篩選品項 */}
          <Col md={2} className="filter-max-width text-center">
            <div className="h4 special-text fw-bold">種類</div>
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

            <h5 className="special-text fw-bold pt-2">價格區間</h5>
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
              {filteredProducts &&
                filteredProducts.map((product, key) => (
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
                    <h5 className="pe-2">NT$ {product.price}</h5>
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
    </div>
  )
}

export default Products
