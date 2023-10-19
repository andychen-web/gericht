import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import { useSelector } from 'react-redux'
import AdminSideBar from '../../components/AdminSideBar.jsx'
import { Row, Col, Button, Modal } from 'react-bootstrap'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Loader from '../../components/Loader.jsx'
const AdminProducts = () => {
  const adminToken = useSelector((state) => state.token.adminToken)
  const [products, setProducts] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [isAdd, setIsAdd] = useState(false)
  const [warningAction, setWarningAction] = useState('')
  const [imgInputMethod, setImgInputMethod] = useState('url')
  const [selectedProduct, setSelectedProduct] = useState({})
  const [productImg, setProductImg] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const MySwal = withReactContent(Swal)
  const [isLoading, setIsLoading] = useState(false)
  const getProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/admin/products/all`,
        { method: 'GET', headers: { Authorization: adminToken } }
      )
      const data = await response.json()
      const newProducts = []
      for (const key in data.products) {
        newProducts.push(data.products[key])
      }
      setProducts(newProducts)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const uploadImg = async (file, fileType) => {
    setUploadStatus('上傳中...')
    const formData = new FormData()
    formData.append('file-to-upload', file)
    if (file && fileType === 'image') {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/admin/upload`,
          {
            method: 'POST',
            headers: {
              Authorization: adminToken
            },
            body: formData
          }
        )
        const data = await response.json()
        if (data.success) {
          handleAlert('上傳成功')
          setUploadStatus('上傳完成')
          setProductImg(data.imageUrl)
        }
      } catch (error) {
        handleAlert('上傳失敗，請壓縮圖檔後嘗試')
        setUploadStatus('')
      }
    }
  }
  const handleImgChange = (e) => {
    const file = e.target.files[0]
    const fileType = file.type.slice(0, 5)
    uploadImg(file, fileType)
  }
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('必填'),
    category: Yup.string().required('必填'),
    origin_price: Yup.number().typeError('必須為數字').required('必填'),
    price: Yup.number().typeError('必須為數字').required('必填'),
    unit: Yup.string().required('必填'),
    description: Yup.string().required('必填')
  })
  let initFormValues
  if (Object.keys(selectedProduct).length > 0) {
    initFormValues = {
      title: selectedProduct.title,
      category: selectedProduct.category,
      imageUrl: selectedProduct.image,
      origin_price: selectedProduct.origin_price,
      price: selectedProduct.price,
      unit: selectedProduct.unit,
      description: selectedProduct.description
    }
  } else {
    initFormValues = {
      title: '',
      category: '',
      imageUrl: '',
      origin_price: '',
      price: '',
      unit: '份',
      description: ''
    }
  }
  const handleAlert = (message) => {
    MySwal.fire({
      title: <p className="fs-4">{message}</p>,
      timer: 1500
    })
  }
  const handleAdd = async (values) => {
    let submittedImg
    if (imgInputMethod === 'url') {
      submittedImg = values.imageUrl
    } else if (imgInputMethod === 'upload' && productImg) {
      submittedImg = productImg
    }
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/admin/product`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: adminToken
          },
          body: JSON.stringify({
            data: {
              title: values.title,
              origin_price: values.origin_price,
              price: values.price,
              category: values.category,
              image: submittedImg,
              description: values.description,
              unit: values.unit,
              quantity: 1
            }
          })
        }
      )
      const data = await response.json()
      if (data.success) {
        setIsAdd(false)
        handleAlert('新增成功')
        getProducts()
      }
    } catch (error) {
      handleAlert('新增失敗')
    }
    setIsLoading(false)
    setProductImg('')
  }
  const handleEdit = async (values) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/admin/product/${selectedProduct.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: adminToken
          },
          body: JSON.stringify({
            data: {
              title: values.title,
              origin_price: values.origin_price,
              price: values.price,
              category: values.category,
              image: values.imgUrl,
              description: values.description,
              id: selectedProduct.id,
              unit: selectedProduct.unit,
              quantity: selectedProduct.quantity
            }
          })
        }
      )
      const data = await response.json()

      if (data.success) {
        setIsEdit(false)
        handleAlert('編輯成功')
        getProducts()
      }
    } catch (error) {
      handleAlert('編輯失敗')
    }
    setIsLoading(false)
  }
  // available for test category only
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/admin/product/${selectedProduct.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: adminToken
          }
        }
      )
      const data = await response.json()
      if (data.success) {
        handleAlert('刪除成功')
        getProducts()
      }
    } catch (error) {
      handleAlert('刪除失敗')
    }
    setWarningAction('')
  }
  const handleDiscontinue = async (confirm) => {
    if (confirm) {
      setIsLoading(true)
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/admin/product/${selectedProduct.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: adminToken
            },
            body: JSON.stringify({
              data: {
                id: selectedProduct.id,
                title: selectedProduct.title,
                origin_price: selectedProduct.origin_price,
                price: selectedProduct.price,
                unit: selectedProduct.unit,
                quantity: selectedProduct.quantity,
                category: '下架',
                image: selectedProduct.image
              }
            })
          }
        )
        const data = await response.json()
        if (data.success) {
          handleAlert('下架成功')
          setWarningAction('')
          getProducts()
        }
      } catch (error) {
        handleAlert('下架失敗')
      }
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])
  return (
    <main className="bg-beige">
      <Loader isLoading={isLoading} />
      <Container className="px-0 custom-padding-top pb-5 d-flex flex-column align-items-center">
        <Row className="m-0 w-100">
          <AdminSideBar />
          <Col md="10" className="px-0">
            <div className="ps-3">
              <div className="h2 fw-bold">商品列表</div>
              <button
                onClick={() => {
                  setIsAdd(true)
                  setSelectedProduct({})
                }}
                className="btn btn-dark fw-bold mt-2 mb-3"
              >
                添加新產品
              </button>
            </div>
            <Container>
              <Row>
                {products.length > 0 &&
                  products.map((product, index) => (
                    <div className="col-12 mb-4" key={index}>
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-4 col-6">
                              <h5 className="card-title fw-bold">產品名稱</h5>
                              <p>{product.title}</p>
                            </div>
                            <div className="col-md-2  col-6 border-sm-none border-2 border-start">
                              <h5 className="card-title fw-bold">分類</h5>
                              <p>
                                {product.category === '下架'
                                  ? `❌${product.category}`
                                  : product.category}
                              </p>
                            </div>
                            <div className="col-md-2  col-6 border-sm-none border-2 border-start">
                              <h5 className="card-title fw-bold">原價</h5>
                              <p>${product.origin_price}</p>
                            </div>
                            <div className="col-md-2  col-6 border-sm-none border-2 border-start">
                              <h5 className="card-title fw-bold">售價</h5>
                              <p>${product.price}</p>
                            </div>
                            <div className="col-md-2  col-12 my-auto">
                              <Button
                                variant="dark"
                                size="sm"
                                onClick={() => {
                                  setIsEdit(true)
                                  setSelectedProduct(product)
                                }}
                                className="mr-2 font-weight-bold mx-1"
                              >
                                編輯
                              </Button>
                              {product.category !== '下架' && (
                                <Button
                                  variant="warning"
                                  size="sm"
                                  className="font-weight-bold m-1"
                                  onClick={() => {
                                    setWarningAction('下架')
                                    setSelectedProduct(product)
                                  }}
                                >
                                  下架
                                </Button>
                              )}

                              {/* available for test category only */}
                              {product.category === 'test' && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className="font-weight-bold mx-1"
                                  onClick={() => {
                                    setWarningAction('刪除')
                                    setSelectedProduct(product)
                                  }}
                                >
                                  刪除
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </Row>
            </Container>
            {/* 新增或編輯商品 */}
            <Modal show={isEdit || isAdd} centered>
              <Formik
                initialValues={initFormValues}
                validationSchema={validationSchema}
                onSubmit={isEdit ? handleEdit : isAdd ? handleAdd : null}
              >
                <Form>
                  <Modal.Header>
                    <Modal.Title>產品基本資料</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <Row>
                      <Col sm={4}>
                        {imgInputMethod === 'url' && (
                          <div className="pt-2 form-group">
                            <label>輸入圖片網址</label>
                            <Field
                              name="imageUrl"
                              className="form-control"
                              placeholder="請輸入圖片網址"
                            />
                            <ErrorMessage
                              name="imageUrl"
                              component="span"
                              className="text-danger custom-small-font"
                            />
                            <button
                              className="btn btn-dark mt-2"
                              onClick={() => setImgInputMethod('upload')}
                            >
                              上傳圖片
                            </button>
                          </div>
                        )}
                        {imgInputMethod === 'upload' && (
                          <div className="d-flex flex-column">
                            <button
                              className="btn btn-sm btn-dark m-2"
                              onClick={() => setImgInputMethod('url')}
                            >
                              上傳圖片連結
                            </button>
                            <Button variant="warning" size="sm" className="m-2">
                              <input
                                type="file"
                                id="productImg"
                                onChange={handleImgChange}
                                className="d-none"
                              ></input>
                              <label
                                htmlFor="productImg"
                                className="cursor-pointer"
                              >
                                上傳圖片
                              </label>
                            </Button>
                            <div className="ms-2">{uploadStatus}</div>
                            <div className="pt-3">
                              {productImg && (
                                <img
                                  src={productImg}
                                  className="rounded"
                                  width={'100%'}
                                  height={'100%'}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </Col>
                      <Col sm={8}>
                        <div className="pt-2 form-group">
                          <label>標題</label>
                          <Field
                            name="title"
                            className="form-control"
                            placeholder="請輸入標題"
                          />
                          <ErrorMessage
                            name="title"
                            component="span"
                            className="text-danger custom-small-font"
                          />
                        </div>

                        <div className="wrap d-flex">
                          <div className="pt-2 form-group w-50">
                            <label>分類</label>
                            <Field
                              name="category"
                              className="form-control"
                              placeholder="請輸入分類"
                            />
                            <ErrorMessage
                              name="category"
                              component="span"
                              className="text-danger custom-small-font "
                            />
                          </div>
                          <div className="pt-2 form-group ms-2 w-50">
                            <label>單位</label>
                            <Field
                              name="unit"
                              className="form-control"
                              placeholder="請輸入分類"
                            />
                            <ErrorMessage
                              name="unit"
                              component="span"
                              className="text-danger custom-small-font"
                            />
                          </div>
                        </div>
                        <div className="wrap d-flex">
                          <div className="pt-2 form-group">
                            <label>原價</label>
                            <Field
                              name="origin_price"
                              placeholder="請輸入原價"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="origin_price"
                              component="span"
                              className="text-danger custom-small-font"
                            />
                          </div>
                          <div className="pt-2 ms-2 form-group">
                            <label>售價</label>
                            <Field
                              name="price"
                              placeholder="請輸入售價"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="price"
                              component="span"
                              className="text-danger custom-small-font"
                            />
                          </div>
                        </div>

                        <div className="pt-2 form-group">
                          <label>產品描述</label>
                          <Field
                            as="textarea"
                            rows="4"
                            name="description"
                            placeholder="請輸入產品描述"
                            className="form-control text-wrap"
                          />
                          <ErrorMessage
                            name="description"
                            component="span"
                            className="text-danger custom-small-font"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Modal.Body>

                  <Modal.Footer>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEdit(false)
                        setIsAdd(false)
                      }}
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
            {/* 確認操作 */}
            <Modal show={warningAction !== ''} centered className="border-0">
              <div className="modal-header bg-dark text-white">
                <h5 id="exampleModalLabel" className="modal-title">
                  <span>確定要{warningAction}嗎?</span>
                </h5>
                <button
                  type="button"
                  onClick={() => setWarningAction('')}
                  aria-label="Close"
                  className="btn text-white"
                >
                  X
                </button>
              </div>
              <Modal.Body className="text-center">
                是否{warningAction}
                <br />
                <div className="text-dark fw-bold h5 p-1">
                  {selectedProduct.title}
                </div>
              </Modal.Body>
              <div className="modal-footer">
                <button
                  type="button"
                  data-dismiss="modal"
                  className="btn btn-outline-secondary"
                  onClick={() => setWarningAction('')}
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    warningAction === '下架' && handleDiscontinue(true)
                    warningAction === '刪除' && handleDelete(true)
                  }}
                  className="btn btn-outline-danger"
                >
                  確認
                </button>
              </div>
            </Modal>
            {/* pagination */}
            {/* <div className="d-center mb-5 pb-5 text-dark">
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
                              onClick={() => getOrders(index + 1)}
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
                </div> */}
          </Col>
        </Row>
      </Container>
    </main>
  )
}
export default AdminProducts
