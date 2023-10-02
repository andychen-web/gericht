import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Alert from '../components/Alert'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { setAdminToken } from '../slices/tokenSlice'
import { setCurrentUser } from '../slices/userSlice'

const AdminAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [alertQueue, setAlertQueue] = useState([])
  const initialSignInValues = {
    email: '',
    password: ''
  }

  const signinSchema = Yup.object().shape({
    email: Yup.string().email('需為有效的Email').required('需為有效的Email'),
    password: Yup.string().min(6, '密碼長度不足').required('密碼必填')
  })
  const handleAlert = (message) => {
    setAlertQueue((prevQueue) => [...prevQueue, { message }])
  }
  const signIn = async (values) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        'https://vue3-course-api.hexschool.io/v2/admin/signin',
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: values.email,
            password: values.password
          })
        }
      )
      const data = await response.json()
      if (data.success) {
        handleAlert('登入成功')
        if (
          values.email === `${process.env.REACT_APP_ADMIN_EMAIL}` &&
          values.password === `${process.env.REACT_APP_ADMIN_PASSWORD}`
        ) {
          dispatch(setAdminToken(data.token))
          dispatch(setCurrentUser()) // ?
          setTimeout(() => navigate('/orders'), 1500)
        }
      } else if (!data.success) {
        handleAlert('登入失敗')
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="bg">
      <Alert alertQueue={alertQueue} setAlertQueue={setAlertQueue} />
      <Loader isLoading={isLoading} />

      <Container className="pb-5 custom-padding-top">
        <Formik
          initialValues={initialSignInValues}
          validationSchema={signinSchema}
          onSubmit={(values) => signIn(values)}
        >
          <Form className="text-dark bg-beige px-5 py-3 rounded m-auto auth-card">
            <h3>管理員登入</h3>
            <div className="form-group pb-1 pt-3 custom-small-font">
              <label htmlFor="userEmail" className="h5">
                電子信箱
              </label>
              <Field
                type="text"
                name="email"
                className="form-control form-control-sm custom-small-font"
                id="userEmail"
                placeholder="請輸入電子郵件"
              />
              <ErrorMessage
                name="email"
                component="span"
                className="text-danger custom-small-font"
              />
            </div>
            <div className="form-group py-1  custom-small-font">
              <label htmlFor="password" className="h5">
                密碼
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                placeholder="請輸入密碼"
                className="form-control form-control-sm custom-small-font"
              />
              <ErrorMessage
                name="password"
                component="span"
                className="text-danger custom-small-font"
              />
            </div>
            <button type="submit" className="btn btn-dark mt-2">
              資料送出
            </button>
          </Form>
        </Formik>
        {/* TODO: 加入CAPTCHA或其他防駭機制 */}
        <Footer />
      </Container>
    </div>
  )
}

export default AdminAuth
