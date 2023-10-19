import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Loader from './Loader'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { setCompletedOrders } from '../slices/orderFormSlice'

const Order = ({ order }) => {
  Order.propTypes = {
    order: PropTypes.object
  }
  const [isUpdate, setIsUpdate] = useState(false)
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const orderDetails = [
    { label: '訂購人', value: order.name },
    { label: '訂單金額', value: 'NT$' + order.total },
    {
      label: '付款方式',
      value: order.paymentMethod
    },
    { label: '訂單狀態', value: order.orderStatus }
  ]
  const updateOrderStatus = async (newStatus) => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `${process.env.REACT_APP_CUSTOM_API}/orders/${order._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_ORDER_API_KEY}`
          },
          body: JSON.stringify({ orderStatus: newStatus })
        }
      )
      const data = await res.json()
      if (data.success) {
        setIsUpdate(true)
      }
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }
  const getAllOrders = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_CUSTOM_API}/orders`, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_ORDER_API_KEY}`
        }
      })
      const data = await res.json()
      dispatch(setCompletedOrders(data.orders))
    } catch (err) {
      console.log(err)
    }
  }
  if (isUpdate) {
    getAllOrders()
    setIsUpdate(false)
  }

  if (order.takeoutInfo) {
    orderDetails.push(
      {
        label: '預計取餐時間',
        value: order.pickupTime
      },
      { label: '外帶店家', value: order.takeoutInfo.branch }
    )
  } else if (order.deliveryLocation) {
    orderDetails.push(
      {
        label: '預計送達時間',
        value: order.pickupTime
      },
      { label: '外送地點', value: order.deliveryLocation }
    )
  }
  const buyerDetails = [
    { label: '買家姓名', value: order.name },
    { label: '買家手機', value: order.mobile },
    { label: '買家信箱', value: order.email },
    { label: '買家備註', value: order.message ? order.message : '無' }
  ]
  const productArr = order.cartItems.map((item) => [
    { label: '商品名稱', value: item.title },
    { label: '商品數量', value: item.quantity },
    { label: '商品總價', value: 'NT$' + item.price * item.quantity }
  ])
  const productImgArr = order.cartItems.map((item) => item.imageUrl)

  return (
    <div className="bg-beige">
      <Loader isLoading={isLoading} />
      <Container className="custom-padding-top">
        <div className="row d-center mb-1 ">
          <div className="col-md-5">
            <h4 className="fw-bold mb-3">訂單資訊</h4>
            <div className="border rounded bg-white px-3 py-1 mb-5">
              <ul className="row list-unstyled">
                {orderDetails.map((detail, key) => {
                  return (
                    <li key={key} className="p-2 col-lg-6 col-sm-12">
                      <div>
                        <div>
                          <div className="fw-bold fs-5">{detail.label}</div>
                          <div>{detail.value}</div>
                        </div>
                      </div>
                    </li>
                  )
                })}
                <div className="d-flex justify-content-start mt-3">
                  <button
                    className={`cursor-pointer btn btn-success ${
                      order.orderStatus === '已取餐' ||
                      order.orderStatus === '已取消'
                        ? 'd-none'
                        : ''
                    }`}
                    onClick={() => updateOrderStatus('已取餐')}
                  >
                    確認已取餐
                  </button>
                  <button
                    className={`ms-2 cursor-pointer btn btn-danger ${
                      order.orderStatus === '已取餐' ||
                      order.orderStatus === '已取消'
                        ? 'd-none'
                        : ''
                    }`}
                    onClick={() => updateOrderStatus('已取消')}
                  >
                    取消訂單
                  </button>
                </div>
              </ul>
            </div>
            <h4 className="fw-bold mb-3">買家資訊</h4>
            <div className="border rounded bg-white p-3 mb-5">
              <ul className="list-unstyled">
                {buyerDetails.map((detail, key) => {
                  return (
                    <li key={key} className="p-2">
                      <div className="flex-between">
                        <div>
                          <div className="fw-bold fs-5">{detail.label}</div>
                          <div className="">{detail.value}</div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <div className="col-md-5">
            <h4 className="fw-bold mb-3">訂購商品</h4>

            {productArr &&
              productArr.map((productDetails, key) => {
                return (
                  <div
                    key={key}
                    className="card rounded bg-white mb-6 px-2 pb-2 px-md-3 pb-md-3"
                  >
                    <div className="row align-items-center g-0 mt-2 mt-md-3">
                      <div className="col-4">
                        <img
                          width={'100%'}
                          height={'auto'}
                          className="rounded"
                          src={productImgArr[key]}
                        ></img>
                      </div>
                      <div className="col-7">
                        <div className="card-body">
                          <ul className="list-unstyled">
                            {productDetails.map((detail, key) => {
                              return (
                                <li key={key} className="p-2">
                                  <div className="row flex-between">
                                    <div className="fw-bold">
                                      {detail.label}
                                    </div>
                                    <div>{detail.value}</div>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
        <div className="d-center">
          <button
            onClick={() => navigate('/admin/orders')}
            className="cursor-pointer custom-btn mb-5"
          >
            返回列表
          </button>
        </div>
      </Container>
    </div>
  )
}

export default Order
