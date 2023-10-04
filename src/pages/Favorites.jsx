import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/esm/Container'
import { BsFillCartFill, BsFillTrash3Fill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Loader from '../components/Loader'
import { setCartUpdate } from '../slices/cartSlice'
import { removeFavorite } from '../slices/favoritesSlice'

const Favorites = () => {
  const navigate = useNavigate()
  const favorites = useSelector((state) => state.favorite.favoriteList)
  const token = useSelector((state) => state.token.token)
  const [isLoading, setIsLoading] = useState(false)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const [alertQueue, setAlertQueue] = useState([])
  const dispatch = useDispatch()
  const isSmallScreen = window.innerWidth < 768

  const handleAlert = (message) => {
    setAlertQueue((prevQueue) => [...prevQueue, { message }])
  }
  const addToCart = async (favorite) => {
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

    const updatedProduct = await updatedProducts.products.find(
      (item) => item.title === favorite.title
    )
    if (updatedProduct) {
      duplicate = { ...updatedProduct }
    } else if (cartItems) {
      duplicate = cartItems.find((item) => item.title === favorite.title)
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
                title: favorite.title,
                origin_price: favorite.origin_price,
                price: favorite.price,
                unit: favorite.unit,
                quantity: duplicate.quantity + 1,
                category: favorite.category,
                imageUrl: favorite.image
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
                title: favorite.title,
                origin_price: favorite.origin_price,
                price: favorite.price,
                unit: favorite.unit,
                quantity: favorite.quantity,
                category: favorite.category,
                imageUrl: favorite.image
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

  const addAllToCart = async () => {
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

    for (let fav = 0; fav < favorites.length; fav++) {
      const updatedProduct = updatedProducts.products.find(
        (item) => item.title === favorites[fav].title
      )
      if (updatedProduct) {
        duplicate = { ...updatedProduct }
      } else if (cartItems) {
        duplicate = cartItems.find(
          (item) => item.title === favorites[fav].title
        )
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
                  title: favorites[fav].title,
                  origin_price: favorites[fav].origin_price,
                  price: favorites[fav].price,
                  unit: favorites[fav].unit,
                  quantity: duplicate.quantity + 1,
                  category: favorites[fav].category,
                  imageUrl: favorites[fav].image
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
                  title: favorites[fav].title,
                  origin_price: favorites[fav].origin_price,
                  price: favorites[fav].price,
                  unit: favorites[fav].unit,
                  quantity: favorites[fav].quantity,
                  category: favorites[fav].category,
                  imageUrl: favorites[fav].image
                }
              })
            }
          )
          const data = await response.json()
          if (data.success) {
            handleAlert('已新增至購物車')
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!token) {
      navigate('/userAuth')
    }
  }, [token])
  return (
    <div>
      <Loader isLoading={isLoading} />
      {<Alert alertQueue={alertQueue} setAlertQueue={setAlertQueue} />}

      <Container className="custom-padding-top mw-50">
        <div className="favorites justify-content-center d-flex mt-5">
          <h3 className="text-dark">收藏項目</h3>
        </div>
        <div className="favorites text-center">
          {favorites.length > 0 && (
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th className="py-2">操作</th>
                  <th className="py-2">品名</th>
                  <th className="py-2">單價</th>
                  {isSmallScreen ? null : <th className="py-2">商品連結</th>}
                </tr>
              </thead>
              <tbody>
                {favorites &&
                  favorites.map((favorite, key) => (
                    <tr key={key} className="align-center">
                      <td>
                        <button
                          type="button"
                          onClick={() => dispatch(removeFavorite(favorite))}
                          className="btn btn-outline-danger me-md-2 btn-sm"
                        >
                          {isSmallScreen ? <BsFillTrash3Fill /> : '取消收藏'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(favorite)
                            handleAlert('已加入購物車')
                          }}
                          className="btn-outline-dark btn-sm btn"
                        >
                          {isSmallScreen ? <BsFillCartFill /> : '加入購物車'}
                        </button>
                      </td>
                      <td>{favorite.title}</td>
                      <td>
                        {'$' + favorite.price} / {favorite.unit}
                      </td>
                      {isSmallScreen ? null : (
                        <td>
                          <button
                            className="custom-btn custom-small-font"
                            onClick={() => navigate(`/product/${favorite.id}`)}
                          >
                            查看更多
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          {favorites.length > 0 ? (
            <button
              className="btn btn-dark my-3"
              onClick={() => addAllToCart()}
            >
              全部加入購物車
            </button>
          ) : (
            <div>
              <div className="h5 mt-4">您的收藏項目是空的</div>
              <div
                onClick={() => navigate('/products')}
                className="h1 btn btn-dark mt-3"
              >
                返回商品頁
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

export default Favorites
