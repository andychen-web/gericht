import * as Yup from 'yup'
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
import { setCartItems, updateItemQuantity } from '../slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Loader from '../components/Loader'

import { setOrderForm } from '../slices/orderFormSlice'
import { setShippingFee, setSum, setTotal } from '../slices/priceSlice'

import zhTW from 'date-fns/locale/zh-TW'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getHours, setHours, setMinutes } from 'date-fns'

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('需為有效的電子信箱')
    .required('需為有效的電子信箱'),
  name: Yup.string().required('姓名為必填'),
  mobile: Yup.number().typeError('電話號碼需為數字').required('電話號碼為必填')
})

const Cart = () => {
  const navigate = useNavigate()
  const token = useSelector((state) => state.token.token)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const takeoutInfo = useSelector((state) => state.cart.takeoutInfo)
  const deliveryLocation = useSelector((state) => state.cart.deliveryLocation)
  const currentUser = useSelector((state) => state.user.currentUser)
  const [showCheckout, setShowCheckout] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(null)
  const [changeCounter, setChangeCounter] = useState(0)
  const [alertQueue, setAlertQueue] = useState([])
  const dispatch = useDispatch()
  const initFormValues = {
    email: currentUser && currentUser.email,
    name: currentUser && currentUser.name,
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
  let total
  if (deliveryLocation) {
    total = sum + shippingFee
  } else {
    total = sum
  }
  const confirmCheckout = () => {
    if (cartItems.length > 0) {
      if (takeoutInfo || deliveryLocation) {
        setShowCheckout(true)
      } else {
        navigate('/pickupMethods')
      }
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
    let minutes = time.getMinutes()
    if (minutes === 0) {
      minutes = '00'
    }
    if (takeoutInfo) {
      dispatch(
        setOrderForm({
          ...values,
          takeoutInfo,
          pickupTime:
            time.toLocaleDateString('zh-CN') +
            ' ' +
            time.getHours() +
            ':' +
            minutes
        })
      )
    } else if (deliveryLocation) {
      dispatch(
        setOrderForm({
          ...values,
          deliveryLocation,
          pickupTime:
            time.toLocaleDateString('zh-CN') +
            ' ' +
            time.getHours() +
            ':' +
            minutes
        })
      )
    }
    navigate('/checkout')
  }

  const putQuantity = async (updatedProduct) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}api/newcart1/admin/product/${updatedProduct.id}`,
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
      // eslint-disable-next-line no-unused-vars
      const data = await response.json()
    } catch (error) {
      console.log(error)
    }
  }
  const handleRemove = async (itemId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API}api/newcart1/admin/product/${itemId}`,
        {
          headers: { Authorization: token },
          method: 'DELETE'
        }
      )
      // eslint-disable-next-line no-unused-vars
      const data = await res.json()
      getCart(token)
    } catch (err) {
      console.log(err)
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
  const getCart = async (token) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}api/newcart1/admin/products/all`,
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
  // 選擇取餐時間
  const currentTime = new Date().getHours()
  const openHours = {
    lunchStart: 11,
    lunchEnd: 14.5,
    dinnerStart: 17,
    dinnerEnd: 20.5
  }
  let selectedTime
  if (currentTime < openHours.lunchStart) {
    selectedTime = openHours.lunchStart
  } else if (
    currentTime >= openHours.lunchStart &&
    currentTime <= openHours.lunchEnd
  ) {
    selectedTime = openHours.lunchEnd
  } else if (
    currentTime >= openHours.lunchEnd &&
    currentTime <= openHours.dinnerStart
  ) {
    selectedTime = openHours.dinnerStart
  } else if (
    currentTime >= openHours.dinnerStart &&
    currentTime <= openHours.dinnerEnd
  ) {
    selectedTime = openHours.dinnerEnd
  } else {
    selectedTime = null
  }

  registerLocale('zh-TW', zhTW)

  const [time, setTime] = useState(
    setHours(setMinutes(new Date(), 0), selectedTime)
  )
  useEffect(() => {
    if (!token) {
      navigate('/userAuth')
    } else if (token) {
      getCart(token)
    }
  }, [token])
  useEffect(() => {
    if (currentIndex !== null) {
      updatedProduct = cartItems[currentIndex]
      putQuantity(updatedProduct)
    }
  }, [currentIndex, changeCounter])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // eslint-disable-next-line react/prop-types
  function InfoRow({ title, info }) {
    return (
      <div className="row mb-2">
        <div className="col">
          <div className="d-flex">
            <span className="pe-2">{title}</span>
            <span>{info}</span>
          </div>
        </div>
      </div>
    )
  }
  if (token) {
    return (
      <main className="bg">
        <Loader isLoading={isLoading} />
        <Alert alertQueue={alertQueue} setAlertQueue={setAlertQueue} />
        <Container className="custom-padding-top">
          <Row className="custom-pt-md">
            <Col xs={12} lg={7}>
              <div className="header-width rounded h3 d-flex bg-white border p-2">
                <BsFillCartFill />
                <span className="ps-2 fs-5 title-bg text-black">
                  購物車清單
                </span>
              </div>

              <Table
                style={{ borderRadius: '5px', overflow: 'hidden' }}
                bordered
                className="bg-white text-black"
              >
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
                          <td className="d-flex justify-content-start be-0">
                            <button
                              type="button"
                              onClick={() => handleRemove(item.id)}
                              className="btn btn-warning btn-sm sm-font"
                            >
                              <BsFillTrash3Fill />
                            </button>
                            <div className="ps-md-2 pt-1 sm-font">
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
              <div className="bg-white rounded p-2 header-width h3 d-flex">
                <FaPencilAlt />
                <span className="ps-2 fs-5 title-bg text-black">訂單摘要</span>
              </div>
              {/* 取餐資訊 */}
              <Container className="bg-white rounded mb-2 py-2">
                <Row>
                  <Col className="fw-bold fs-5">取餐資訊</Col>
                  <Col className="d-flex justify-content-end">
                    <button
                      className="custom-btn xs"
                      onClick={() => {
                        navigate('/pickupMethods')
                      }}
                    >
                      {deliveryLocation || takeoutInfo ? '修改' : '新增'}
                    </button>
                  </Col>
                </Row>
                <Row className="mt-2">
                  {deliveryLocation || takeoutInfo ? (
                    <Col>
                      {deliveryLocation && (
                        <>
                          <InfoRow title="取餐方式" info={'外送'} />
                          <InfoRow title="外送地址" info={deliveryLocation} />
                        </>
                      )}
                      {takeoutInfo && (
                        <>
                          <InfoRow title="取餐方式" info={'外帶'} />
                          <InfoRow
                            title="取餐地址"
                            info={takeoutInfo && takeoutInfo.address}
                          />
                          <InfoRow
                            title="取餐門市"
                            info={takeoutInfo && takeoutInfo.branch}
                          />
                        </>
                      )}
                      {selectedTime ? (
                        <div className="form-group">
                          <label htmlFor="pickupTime" className="">
                            選擇今日取餐時間
                          </label>
                          <div>
                            <DatePicker
                              name="pickupTime"
                              className="w-50 p-1 rounded"
                              closeOnScroll={true}
                              locale="zh-TW"
                              selected={time}
                              showTimeSelect
                              timeCaption="時段"
                              timeIntervals={30}
                              showTimeSelectOnly
                              dateFormat="aa h:mm"
                              onChange={(date) => setTime(date)}
                              filterTime={(time) => {
                                const hours = getHours(time)
                                return (
                                  (hours >= currentTime &&
                                    hours >= openHours.lunchStart &&
                                    hours < openHours.lunchEnd) ||
                                  (hours >= openHours.dinnerStart &&
                                    hours < openHours.dinnerEnd)
                                )
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </Col>
                  ) : null}
                </Row>
              </Container>
              {/* 結帳金額 */}
              <div className="border bg-white rounded p-2">
                <div className="h6 flex-between pt-2 text-black">
                  <div>小計:</div>
                  <div>{'$' + sum}</div>
                </div>
                {deliveryLocation && (
                  <div className="h6 flex-between pt-2 text-black">
                    <div>運費: </div>
                    <div>{'$' + shippingFee}</div>
                  </div>
                )}
                <div className="h4 flex-between border-top pt-2 text-black fs-5">
                  <div>總計</div> <div>{'$' + total}</div>
                </div>
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
                    <div className="form-group">
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
                      <div className="form-group col-md-">
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
                      <div className="form-group col-md-7">
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
        </Container>
      </main>
    )
  }
}
export default Cart
