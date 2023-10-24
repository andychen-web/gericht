import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Loader from '../../components/Loader.jsx'
import { AiFillFileText } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BsFillTrash3Fill } from 'react-icons/bs'
import { setCompletedOrders } from '../../slices/orderFormSlice.js'
import AdminSideBar from '../../components/AdminSideBar.jsx'

const AdminOrders = () => {
  const navigate = useNavigate()
  const adminToken = useSelector((state) => state.token.adminToken)
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNext, setHasNext] = useState(true)
  const [hasPre, setHasPre] = useState(false)
  const dispatch = useDispatch()
  const getOrders = async (page, orderStatus) => {
    setIsLoading(true)
    if (!orderStatus) {
      orderStatus = 'all'
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_CUSTOM_API}/orders?page=${page}&orderStatus=${orderStatus}`,
        {
          method: 'GET',
          redirect: 'follow',
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_ORDER_API_KEY}`
          }
        }
      )
      const data = await res.json()
      setHasPre(data.pagination.has_pre)
      setHasNext(data.pagination.has_next)
      setTotalPages(data.pagination.total_pages)
      dispatch(setCompletedOrders(data.orders))
      setOrders(data.orders)
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }
  const removeOrder = async (order) => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `${process.env.REACT_APP_CUSTOM_API}/orders/${order._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_ORDER_API_KEY}`
          }
        }
      )
      const data = await res.json()
      if (data.success) {
        getOrders()
      }
    } catch (err) {
      console.log(err)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    if (adminToken) {
      getOrders(1, 'all')
    }
  }, [adminToken])

  useEffect(() => {
    getOrders(currentPage, 'all')
  }, [currentPage])
  return (
    <main className="bg-beige">
      <Loader isLoading={isLoading} />
      <Container className=" px-0 custom-padding-top pb-5 d-flex flex-column align-items-center">
        <Row className="w-100">
          <AdminSideBar />
          <Col md="10">
            <div className="h2 fw-bold">訂單</div>
            <div className="d-flex">
              <button
                onClick={() => getOrders(1, 'all')}
                className="mb-3  mw-sm btn-sm btn btn-dark custom-small-font"
              >
                全部訂單
              </button>
              <button
                onClick={() => getOrders(1, '已取消')}
                className="mb-3 mw-sm btn-sm mx-1 mx-md-3 btn btn-danger custom-small-font"
              >
                已取消訂單
              </button>
              <button
                onClick={() => getOrders(1, '未付款')}
                className="mb-3 mw-sm btn-sm  btn btn-warning custom-small-font"
              >
                尚未付款
              </button>
              <button
                onClick={() => getOrders(1, '已取餐')}
                className="mb-3 mw-sm btn-sm mx-1 mx-md-3 btn btn-success custom-small-font"
              >
                已完成訂單
              </button>
            </div>

            {/* md to lg screen size */}
            <table className="table mb-5 d-none d-md-table">
              <thead>
                <tr className="text-center custom-small-font">
                  <th scope="col">序號</th>
                  <th scope="col">姓名</th>
                  <th scope="col">總金額</th>
                  <th scope="col">付款方式</th>
                  <th scope="col">訂單狀態</th>
                  <th scope="col">刪除訂單</th>
                  <th scope="col">訂單修改</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  ? orders.map((order, index) => {
                      return (
                        <tr key={index} className="text-center">
                          <td scope="row">{order.serialNumber}</td>
                          <td>{order.name}</td>
                          <td>
                            <span>NT$</span>
                            {order.total}
                          </td>
                          <td>{order.paymentMethod}</td>
                          <td>
                            {order.orderStatus === '已取消' && '❌已取消'}
                            {order.orderStatus === '未付款' && '💲未付款'}
                            {order.orderStatus === '已取餐' && '🆗已取餐'}
                          </td>
                          <td>
                            <BsFillTrash3Fill
                              className="fs-5 cursor-pointer"
                              onClick={() => removeOrder(order)}
                            />
                          </td>
                          <td>
                            <AiFillFileText
                              onClick={() => navigate(`/order/${order._id}`)}
                              className="cursor-pointer fs-3"
                            />
                          </td>
                        </tr>
                      )
                    })
                  : null}
              </tbody>
            </table>
            {/* for smaller screen size  */}
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
                                  <div className="card-text">
                                    訂單序號 {order.serialNumber}
                                  </div>
                                </li>
                                <li className="mb-2">
                                  <div className="card-text">
                                    <div> 訂購人:</div>
                                    <div>{order.name}</div>
                                  </div>
                                </li>
                                <li className="mb-2">
                                  <div className="card-text">
                                    商品金額:
                                    <div>{'NT$' + order.total}</div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-4">
                            <button
                              onClick={() => navigate(`/order/${order._id}`)}
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
                  <li className="page-item">
                    <a
                      className={`page-link ${
                        hasPre ? 'cursor-pointer' : 'disabled'
                      }`}
                      onClick={() =>
                        setCurrentPage((prevPage) =>
                          prevPage >= 1 ? prevPage - 1 : prevPage
                        )
                      }
                    >
                      上一頁
                    </a>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => {
                    return (
                      <li
                        key={index}
                        style={{ zIndex: '0' }}
                        className="page-item active cursor-pointer"
                      >
                        <a
                          className="page-link"
                          onClick={() => getOrders(index + 1, 'all')}
                        >
                          {index + 1}
                        </a>
                      </li>
                    )
                  })}
                  <li className="page-item ">
                    <a
                      className={`page-link ${
                        hasNext ? 'cursor-pointer' : 'disabled'
                      }`}
                      onClick={() => {
                        if (hasNext) {
                          setCurrentPage((prevPage) => prevPage + 1)
                        }
                      }}
                    >
                      下一頁
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default AdminOrders
