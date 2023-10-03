import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { BsFillCartFill, BsFillTrash3Fill } from 'react-icons/bs'
import { FaPencilAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Alert from '../components/Alert'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { setCartItems, updateItemQuantity } from '../slices/cartSlice'
import { setOrderForm } from '../slices/orderFormSlice'
import { setShippingFee, setSum, setTotal } from '../slices/priceSlice'

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('需為有效的電子信箱')
    .required('需為有效的電子信箱'),
  name: Yup.string().required('姓名為必填'),
  mobile: Yup.number().typeError('電話號碼需為數字').required('電話號碼為必填'),
  address: Yup.string().required('地址為必填')
})

const Cart = () => {
  const navigate = useNavigate()
  const token = useSelector((state) => state.token.token)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const currentUser = useSelector((state) => state.user.currentUser)
  const [showCheckout, setShowCheckout] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(null)
  const [changeCounter, setChangeCounter] = useState(0)
  const [alertQueue, setAlertQueue] = useState([])
  const dispatch = useDispatch()
  const initFormValues = {
    email: currentUser.email,
    name: currentUser.name,
    address: '',
    mobile: '',
    message: '',
    paymentMethod: ''
  }
  let updatedProduct
  const sum =
    Array.isArray(cartItems) &&
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  let shippingFee = (sum / 20).toFixed(0)
  shippingFee = Number(shippingFee)

  const total = (sum + shippingFee).toLocaleString('zh-TW', {
    style: 'currency',
    currency: 'NTD',
    currencyDisplay: 'code'
  })
  const confirmCheckout = () => {
    if (cartItems.length > 0) {
      setShowCheckout(true)
    } else {
      handleAlert('購物車內無商品無法結帳')
    }
  }
  const handleAlert = (message) => {
    setAlertQueue((prevQueue) => [...prevQueue, { message }])
  }

  const handleSubmit = (values) => {
    // price
    dispatch(setSum(sum))
    dispatch(setShippingFee(shippingFee))
    dispatch(setTotal(total))
    // orderForm
    dispatch(setOrderForm(values))
    navigate('/checkout')
  }

  const putQuantity = async (updatedProduct) => {
    try {
      const response = await fetch(
        `https://vue3-course-api.hexschool.io/v2/api/newcart1/admin/product/${updatedProduct.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
          body: JSON.stringify({
            data: updatedProduct
          })
        }
      )
      const data = await response.json()
      console.g(data)
    } catch (error) {
      console.log(error)
    }
  }

  const incrementQuantity = async (index, change) => {
    dispatch(updateItemQuantity({ index, change }))
    setCurrentIndex(index)
    setChangeCounter((prevState) => prevState + 1)
  }
  const decrementQuantity = (index, change, quantity, itemId) => {
    if (quantity >= 2) {
      dispatch(updateItemQuantity({ index, change }))
      setCurrentIndex(index)
      setChangeCounter((prevState) => prevState + 1)
    } else if (quantity === 1) {
      handleRemove(itemId)
    }
  }
  const fetchCart = async (token) => {
    setIsLoading(true)
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
      const userCartItems = newCartItems.filter(
        (item) => item.uId === currentUser.id
      )
      if (data.success) {
        dispatch(setCartItems(userCartItems))
        setIsLoading(false)
      } else {
        setIsLoading(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (token) {
      fetchCart(token)
    } else {
      navigate('/userAuth')
    }
  }, [token])
  useEffect(() => {
    if (currentIndex !== null) {
      updatedProduct = cartItems[currentIndex]
      putQuantity(updatedProduct)
    }
  }, [currentIndex, changeCounter])
  const handleRemove = async (id) => {
    try {
      const res = await fetch(
        `https://vue3-course-api.hexschool.io/v2/api/newcart1/admin/product/${id}`,
        {
          headers: { Authorization: token },
          method: 'DELETE'
        }
      )
      // eslint-disable-next-line no-unused-vars
      const data = await res.json()
      fetchCart(token)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="bg vh-md-100 d-flex flex-column">
      <Loader isLoading={isLoading} />
      {<Alert alertQueue={alertQueue} setAlertQueue={setAlertQueue} />}

      <Container className="custom-padding-top ">
        {token && (
          <>
            <Row className="custom-pt-md">
              <Col xs={12} lg={7}>
                <div className="text-white h3 d-flex">
                  <BsFillCartFill />
                  <div className="ps-2 fs-5">購物車清單</div>
                </div>

                <Table striped bordered className="bg-white text-black">
                  <thead>
                    <tr className="align-middle text-center">
                      <th>商品</th>
                      <th>數量</th>
                      <th>價格</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.length > 0 &&
                      cartItems.map((item, key) => {
                        return (
                          <tr key={key} className="align-middle text-center">
                            <td className="d-flex justify-content-start">
                              <button
                                type="button"
                                onClick={() => handleRemove(item.id)}
                                className="btn btn-warning btn-sm sm-font"
                              >
                                <BsFillTrash3Fill />
                              </button>
                              <div className="ps-2 pt-1 sm-font">
                                {item.title}
                              </div>
                            </td>
                            <td>
                              <div className="btn-group sm-height">
                                <button
                                  type="button"
                                  onClick={() =>
                                    decrementQuantity(
                                      key,
                                      -1,
                                      item.quantity,
                                      item.id
                                    )
                                  }
                                  className="btn btn-outline-secondary"
                                >
                                  -
                                </button>
                                <button
                                  disabled="disabled"
                                  className="btn btn-outline-secondary"
                                >
                                  {item.quantity}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => incrementQuantity(key, +1)}
                                  className="btn btn-outline-secondary"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td> {'$' + item.price * item.quantity}</td>
                          </tr>
                        )
                      })}
                  </tbody>
                </Table>
              </Col>
              <Col xs={12} lg={5}>
                <div className="text-white h3 d-flex">
                  <FaPencilAlt />
                  <div className="ps-2 fs-5">訂單摘要</div>
                </div>
                <div className="border bg-white rounded p-2">
                  <h6 className="flex-between p-xs-1 p-md-2 text-black">
                    <div>小計:</div>
                    <div>{'$' + sum}</div>
                  </h6>
                  <h6 className="flex-between p-sm-1 p-md-2 pt-0 text-black">
                    <div>運費:</div> <div>{'$' + shippingFee}</div>
                  </h6>
                  <h4 className="flex-between border-top p-sm-1 p-md-2 text-black fs-5">
                    <div>總計</div> <div>{total}</div>
                  </h4>
                  <button
                    className="btn fw-bold w-100 px-5 my-1 btn-danger"
                    onClick={() => confirmCheckout()}
                  >
                    確認結帳
                  </button>
                </div>
              </Col>
            </Row>
            {showCheckout && (
              <Modal show={showCheckout}>
                <Formik
                  initialValues={initFormValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    <Modal.Header>
                      <Modal.Title>訂單基本資料</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                      <div className="form-group py-1">
                        <label htmlFor="userEmail">
                          電子信箱
                          <i className="text-danger">*</i>
                        </label>
                        <Field
                          type="text"
                          name="email"
                          className="form-control form-control-sm custom-small-font"
                          id="userEmail"
                          placeholder="請輸入訂購人電子郵件"
                        />
                        <ErrorMessage
                          name="email"
                          component="span"
                          className="text-danger custom-small-font"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-5 py-1">
                          <label htmlFor="username">
                            姓名
                            <i className="text-danger">*</i>
                          </label>
                          <Field
                            type="text"
                            name="name"
                            id="username"
                            className="form-control form-control-sm custom-small-font"
                            placeholder="請輸入訂購人姓名"
                          />
                          <ErrorMessage
                            name="name"
                            component="span"
                            className="text-danger custom-small-font"
                          />
                        </div>
                        <div className="form-group col-md-7 py-1">
                          <label htmlFor="usertel">
                            電話號碼
                            <i className="text-danger">*</i>
                          </label>
                          <Field
                            type="text"
                            name="mobile"
                            id="usertel"
                            className="form-control custom-small-font"
                            placeholder="請輸入訂購人聯絡電話"
                          />
                          <ErrorMessage
                            name="mobile"
                            component="span"
                            className="text-danger custom-small-font"
                          />
                        </div>
                      </div>
                      <div className="form-group py-1">
                        <label htmlFor="useraddress">
                          訂購地址
                          <i className="text-danger">*</i>
                        </label>
                        <Field
                          type="text"
                          name="address"
                          id="useraddress"
                          className="form-control custom-small-font"
                          placeholder="請輸入訂購人地址"
                        />
                        <ErrorMessage
                          name="address"
                          component="span"
                          className="text-danger custom-small-font"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="message">備註</label>
                        <Field
                          name="text"
                          id="message"
                          placeholder="商品備註"
                          className="form-control form-control-sm custom-small-font"
                        />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="btn btn-outline-secondary"
                      >
                        取消
                      </button>

                      <button type="submit" className="btn btn-dark">
                        資料送出
                      </button>
                    </Modal.Footer>
                  </Form>
                </Formik>
              </Modal>
            )}
          </>
        )}
      </Container>
      <Footer />
    </div>
  )
}
export default Cart
