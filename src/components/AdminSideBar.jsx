import React from 'react'
import Col from 'react-bootstrap/Col'

const AdminSideBar = () => {
  return (
    <Col md="2" className="d-none d-md-block sidebar px-0">
      <div className="sidebar-sticky ">
        <h6 className="d-flex justify-content-between mt-1 align-items-center mb-1 text-muted">
          <span className="h4 text-dark fw-bold">後台管理</span>
        </h6>
        <ul className="nav text-left ms-3">
          <li className="nav-item">
            <a href="/admin/products" className="text-dark nav-link p-0">
              產品管理
            </a>
            <a href="/admin/orders" className="text-dark nav-link  p-0 py-2">
              訂單管理
            </a>
          </li>
          {/*  文章管理 */}
        </ul>
      </div>
    </Col>
  )
}

export default AdminSideBar
