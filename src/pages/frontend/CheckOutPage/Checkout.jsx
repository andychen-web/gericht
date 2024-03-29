import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import { FaPencilAlt } from 'react-icons/fa'
import { BsFillCartFill } from 'react-icons/bs'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Loader from '../../../components/Loader'
import { setCartUpdate } from '../../../slices/cartSlice'

const Checkout = () => {
  const MySwal = withReactContent(Swal)
  const [isLoading, setIsLoading] = useState(false)
  const cartItems = useSelector((state) => state.cart.cartItems)
  const sum = useSelector((state) => state.price.sum)
  const token = useSelector((state) => state.token.token)
  const shippingFee = useSelector((state) => state.price.shippingFee)
  const deliveryLocation = useSelector((state) => state.cart.deliveryLocation)
  const total = useSelector((state) => state.price.total)
  const orderForm = useSelector((state) => state.orderForm.orderFormValue)
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  if (!token) {
    navigate('/userAuth')
  }
  useEffect(() => {
    if (!cartItems.length > 0 && step < 3) {
      navigate('/cart')
    }
  }, [cartItems])

  const progressWidth = (step / 3) * 100
  const cleanCart = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API}api/${process.env.REACT_APP_CART_PATH}/product/${id}`,
        {
          headers: { Authorization: token },
          method: 'DELETE'
        }
      )
      // eslint-disable-next-line no-unused-vars
      const data = await res.json()
    } catch (err) {
      console.log(err)
    }
  }
  const handleAlert = (message) => {
    MySwal.fire({
      title: <p className="fs-4">{message}</p>,
      timer: 1500
    })
  }
  function handleStep() {
    const cashOnDeliveryInput = document.querySelector('#cashOnDelivery')
    const transferInput = document.querySelector('#transfer')

    if (step === 1) {
      setStep((prevStep) => prevStep + 1)
    } else if (
      (step === 2) &
      (cashOnDeliveryInput.checked || transferInput.checked)
    ) {
      setStep((prevStep) => prevStep + 1)
    }
  }
  useEffect(() => {
    if (token && step === 3) {
      setIsLoading(true)
      fetch(`${process.env.REACT_APP_CUSTOM_API}/orders/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_ORDER_API_KEY}`
        },
        body: JSON.stringify({
          ...orderForm,
          total,
          cartItems,
          paymentMethod,
          orderStatus: '未付款'
        })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            handleAlert('結帳完成')
          }
          setIsLoading(false)
          const cartIds = cartItems.map((item) => item.id)
          cartIds.forEach((id) => cleanCart(id))
        })
        .catch((error) => console.log('error', error))
    }
  }, [step])

  function showTransferInfo() {
    const transferInfo = document.querySelector('.transfer-info')
    transferInfo.classList.remove('d-none')
  }
  function hideTransferInfo() {
    const transferInfo = document.querySelector('.transfer-info')
    transferInfo.classList.add('d-none')
  }

  return (
    <main className="bg">
      <Loader isLoading={isLoading} />
      <Container className="pt-5">
        <div className="text-white pt-5 text-center">
          <div className="bg-checkout text-white w-100 rounded mb-5 d-flex align-items-center justify-content-center">
            <h4 className="fw-bold text-shadow">結帳流程</h4>
          </div>
          <form className="row d-center">
            <Col xs={12} md={4}>
              {/* 訂單摘要 */}
              <div className="text-white h3 d-flex">
                <div className="pb-2 fs-5">
                  <FaPencilAlt />
                  訂單摘要
                </div>
              </div>
              <div className="border bg-white rounded p-2">
                <div className="flex-between pt-2 text-black pb-2">
                  <div>小計:</div>
                  <div>{'NT$' + sum}</div>
                </div>
                {deliveryLocation && (
                  <div className="flex-between pt-2 text-black pb-2">
                    <div>運費: </div>
                    <div>{'NT$' + shippingFee}</div>
                  </div>
                )}

                <div className="flex-between border-top pt-2 text-black fs-5">
                  <div>總計</div> <div>{'NT$' + total}</div>
                </div>
              </div>
              {/*  購物車內容 */}
              <div className="text-white d-flex flex-column pt-3">
                <div className="pb-2 text-start">
                  <span className="fs-3">
                    <BsFillCartFill />
                  </span>
                  <span className="fs-5">購物車內容</span>
                </div>
                <div className="border bg-white rounded p-2">
                  <table width={'100%'}>
                    <tbody className="w-100 p-3">
                      {cartItems.map((item, key) => {
                        return (
                          <tr key={key} className="text-black flex-between p-2">
                            <td>{item.title}</td>
                            <td>
                              {item.quantity}
                              {item.unit}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
            {/* 結帳 */}
            <Col xs={12} md={6}>
              <div className="p-2">
                <div className="px-3 my-3 text-light flex-between mobile-small-font">
                  <div>1.確認資料</div>
                  <div>2.付款方式</div>
                  <div>3.完成</div>
                </div>

                <div
                  className="progress bg-warning"
                  style={{ width: `${progressWidth}%` }}
                />
                <div className="my-3 bg-light text-dark rounded">
                  {step === 1 && (
                    <div className="p-3">
                      <h5 className="my-3">收件人資料</h5>
                      <table className="table mobile-small-font">
                        <tbody>
                          <tr>
                            <th>Email</th>
                            <td>{orderForm.email}</td>
                          </tr>
                          <tr>
                            <th>姓名</th>
                            <td>{orderForm.name}</td>
                          </tr>
                          <tr>
                            <th>訂購人電話</th>
                            <td>{orderForm.mobile}</td>
                          </tr>
                          <tr>
                            {orderForm.takeoutInfo && (
                              <>
                                <th>取餐門市</th>
                                <td>{orderForm.takeoutInfo.branch}</td>
                              </>
                            )}
                            {orderForm.deliveryLocation && (
                              <>
                                <th>外送地址</th>
                                <td>{orderForm.deliveryLocation}</td>
                              </>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  {/* step 2 */}
                  {step === 2 && (
                    <div className="p-3">
                      <h5 className="my-3">付款方式</h5>
                      <div className="my-3">
                        <div>
                          <input
                            id="cashOnDelivery"
                            name="paymentMethod"
                            type="radio"
                            value="cash"
                            onClick={() => {
                              hideTransferInfo()
                              setPaymentMethod('取貨付款')
                            }}
                          />
                          <label htmlFor="cashOnDelivery">取貨付款</label>
                        </div>
                        <div>
                          <input
                            id="transfer"
                            name="paymentMethod"
                            type="radio"
                            value="transfer"
                            onClick={() => {
                              showTransferInfo()
                              setPaymentMethod('銀行轉帳')
                            }}
                          />
                          <label htmlFor="transfer">銀行轉帳</label>
                        </div>
                      </div>
                      <div className="transfer-info d-none">
                        <p className="my-3">ATM 轉帳繳款資料如下</p>
                        <table className="table table-striped table-bordered text-dark mobile-small-font">
                          <tbody>
                            <tr>
                              <th>◆ 銀行名稱：</th>
                              <td>012 台北富邦銀行</td>
                            </tr>
                            <tr>
                              <th>◆ 戶 名：</th>
                              <td>Gericht股份有限公司</td>
                            </tr>
                            <tr>
                              <th>◆ 帳 號：</th>
                              <td>123-321-123456-7</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* step 3 */}
                  {step === 3 && (
                    <div className="my-3 px-lg-5 py-3">
                      <h3 className="my-4 text-success"> 結帳成功</h3>
                      <table className="table table-striped text-dark m-0">
                        <tbody>
                          <tr>
                            <th>姓名 :</th>
                            <td>{orderForm.name}</td>
                          </tr>
                          <tr>
                            <th>收件人電話 :</th>
                            <td>{orderForm.mobile}</td>
                          </tr>
                          <tr>
                            <th>訂購品項 :</th>
                            <td>
                              {cartItems.map((item) => (
                                <span key={item.id}>
                                  {item.title} x {item.quantity}
                                  <br />
                                </span>
                              ))}
                            </td>
                          </tr>
                          <tr>
                            <th>付款方式 :</th>
                            <td>
                              {orderForm.paymentMethod === 'cash'
                                ? '貨到付款'
                                : '銀行轉帳'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="d-center">
                  {step <= 2 && (
                    <div
                      id="next"
                      onClick={() => handleStep()}
                      className="cursor-pointer custom-btn fw-bold"
                    >
                      下一步
                    </div>
                  )}
                  {step === 3 && (
                    <button
                      onClick={() => {
                        dispatch(setCartUpdate(1))
                        navigate('/products')
                      }}
                      id="toProducts"
                      className="cursor-pointer custom-btn fw-bold me-4"
                    >
                      回到商品列表
                    </button>
                  )}
                </div>
              </div>
            </Col>
          </form>
        </div>
      </Container>
    </main>
  )
}

export default Checkout
