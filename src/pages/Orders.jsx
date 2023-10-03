import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Loader from '../components/Loader'
import Footer from '../components/Footer'
import { AiFillFileText } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setOrderArray } from '../slices/orderFormSlice'
import { BsFillTrash3Fill } from 'react-icons/bs'

const Orders = () => {
  const navigate = useNavigate()
  const adminToken = useSelector((state) => state.token.adminToken)
  const [isLoading, setIsLoading] = useState(false)
  const orders = useSelector((state) => state.orderForm.orderArray)
  const dispatch = useDispatch()
  const parseOrders = (data) => {
    const newArr = []
    for (const item of data) {
      const id = item.id
      const serial = item.id.split('-')[0]
      const parsedItem = JSON.parse(item.name)
      newArr.push({ ...parsedItem, serial, id })
    }
    dispatch(setOrderArray(newArr))
  }
  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('https://api.apilayer.com/form_api/forms', {
        method: 'GET',
        redirect: 'follow',
        headers: { apikey: process.env.REACT_APP_ORDER_API_KEY }
      })
      const data = await res.json()
      console.log(data)
      data && parseOrders(data)
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }
  const removeOrder = async (order) => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `https://api.apilayer.com/form_api/form/${order.id}`,
        {
          method: 'DELETE',
          redirect: 'follow',
          headers: { apikey: process.env.REACT_APP_ORDER_API_KEY }
        }
      )
      const data = await res.json()
      console.log(data)
      fetchOrders()
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    if (adminToken) {
      fetchOrders()
    }
  }, [adminToken])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (orders.length > 0) {
      dispatch(setOrderArray(orders))
    }
  }, [orders])

  return (
    <div className="bg-beige">
      <Loader isLoading={isLoading} />
      <Container className="custom-padding-top pb-5 d-flex flex-column align-items-center">
        {adminToken ? (
          <>
            <h2 className="text-center fw-bold">全部訂單</h2>
            {/* md to lg screen size */}
            <table className="table mb-5 d-none d-md-table">
              <thead>
                <tr className="text-center custom-small-font">
                  <th scope="col">序號</th>
                  <th scope="col">訂單編號</th>
                  <th scope="col">姓名</th>
                  <th scope="col">總金額</th>
                  <th scope="col">付款狀態</th>
                  <th scope="col">訂單狀態</th>
                  <th scope="col">出貨日期</th>
                  <th scope="col">訂單詳情</th>
                  <th scope="col">刪除訂單</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  ? orders.map((order, index) => {
                      return (
                        <tr key={index} className="text-center">
                          <td scope="row">{index + 1}</td>
                          <td>{order.serial}</td>
                          <td>{order.name}</td>
                          <td>
                            <span>NT$</span>
                            {order.total}
                          </td>
                          <td className="text-secondary">未付款</td>
                          <td className="">確認中</td>
                          <td>-</td>
                          <td>
                            <AiFillFileText
                              onClick={() => navigate(`/order/${order.serial}`)}
                              className="cursor-pointer fs-3"
                            />
                          </td>
                          <td>
                            <BsFillTrash3Fill
                              className="fs-5 cursor-pointer"
                              onClick={() => removeOrder(order)}
                            />
                          </td>
                        </tr>
                      )
                    })
                  : null}
              </tbody>
            </table>
            {/* for smaller screen size */}
            <ul className="d-md-none list-unstyled mb-6">
              {orders
                ? orders.map((order, index) => {
                    return (
                      <li key={index} className="card mb-3">
                        <div className="row align-items-center">
                          <div className="col-8">
                            <div className="card-body">
                              <ul className="list-unstyled">
                                <li className="mb-2">
                                  <p className="card-text">
                                    <span className="ms-1">
                                      #{order.serial}
                                    </span>
                                  </p>
                                </li>
                                <li className="mb-2">
                                  <p className="card-text">
                                    訂購人:
                                    <span className="ms-1">{order.name}</span>
                                  </p>
                                </li>
                                <li className="mb-2">
                                  <p className="card-text">
                                    商品金額:
                                    <span className="ms-1">
                                      <span>NT$</span>
                                      {order.total}
                                    </span>
                                  </p>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-4">
                            <button
                              onClick={() => navigate(`/order/${order.serial}`)}
                              className="cursor-pointer custom-btn custom-small-font"
                            >
                              查看訂單
                            </button>
                            <button
                              onClick={() => removeOrder(order)}
                              className="btn btn-white ps-4"
                            >
                              <BsFillTrash3Fill />
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })
                : null}
            </ul>

            <div className="d-center mb-5 pb-5 text-dark">
              <nav aria-label="page">
                <ul className="pagination">
                  <li className="page-item disabled">
                    <a className="page-link" href="#">
                      上一頁
                    </a>
                  </li>
                  <li className="page-item active" style={{ zIndex: '0' }}>
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      下一頁
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        ) : (
          <div className="d-flex flex-column py-5 align-items-center">
            <h3> 您還未登入管理員</h3>
            <button
              className="custom-btn"
              onClick={() => navigate('/adminAuth')}
            >
              前往登入
            </button>
          </div>
        )}
      </Container>
      <Footer />
    </div>
  )
}

export default Orders
