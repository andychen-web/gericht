import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { setAdminToken, setToken } from '../slices/tokenSlice'
import { useDispatch } from 'react-redux'
import Alert from '../components/Alert'

const Auth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [alertQueue, setAlertQueue] = useState([])
  const initialSignInValues = {
    email: '',
    password: ''
  }
  const signinSchema = Yup.object().shape({
    email: Yup.string().email('需為有效的Email').required('需為有效的Email'),
    password: Yup.string()
      .min(8, '密碼長度不足')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        '密碼必須包含至少一個字母和數字'
      )
      .required('密碼必填')
  })
  const handleAlert = (message) => {
    setAlertQueue((prevQueue) => [...prevQueue, { message }])
  }
  const handleSubmit = (values) => {
    signIn(values)
  }
  const authorize = async (token) => {
    try {
      const res = await fetch(
        'https://vue3-course-api.hexschool.io/v2/api/user/check',
        {
          method: 'POST',
          headers: { Authorization: token }
        }
      )
      // eslint-disable-next-line no-unused-vars
      const data = await res.json()
    } catch (error) {
      console.log(error)
    }
  }
  const signIn = async (values) => {
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
        // admin login
        if (
          values.email === `${process.env.REACT_APP_ADMIN_EMAIL}` &&
          values.password === `${process.env.REACT_APP_ADMIN_PASSWORD}`
        ) {
          dispatch(setAdminToken(data.token))
          navigate('/orders')
        } else {
          // user login
          dispatch(setToken(data.token))
          authorize(data.token)
          navigate('/products')
        }
      } else if (!data.success) {
        handleAlert('登入失敗')
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

      <Container className="pb-5 custom-padding-top">
        <Formik
          initialValues={initialSignInValues}
          validationSchema={signinSchema}
          onSubmit={handleSubmit}
        >
          <Form className="text-dark bg-beige px-5 py-3 rounded m-auto auth-card">
            <h3>登入</h3>
            <div className="form-group py-1 custom-small-font">
              <label htmlFor="userEmail">
                電子信箱
                <i className="text-danger">*</i>
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
            <div className="form-group py-1 custom-small-font">
              <label htmlFor="password">
                密碼
                <i className="text-danger">*</i>
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                placeholder="請輸入英文數字混和的密碼"
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
        <Footer />
      </Container>
    </div>
  )
}

export default Auth
