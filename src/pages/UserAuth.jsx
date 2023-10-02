import { GoogleLogin } from '@react-oauth/google'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import jwtDecode from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Alert from '../components/Alert'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { setToken } from '../slices/tokenSlice'
import { setCurrentUser } from '../slices/userSlice'
const UserAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [alertQueue, setAlertQueue] = useState([])
  const [isRegistered, setIsRegistered] = useState(true)
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
  const handleSubmit = (isRegistered, values) => {
    if (isRegistered) {
      signIn(values)
    } else {
      signUp(values)
    }
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
        setTimeout(() => navigate('/products'), 1500)
        const userInfo = jwtDecode(data.token)
        dispatch(
          setCurrentUser({
            id: userInfo.sub,
            name: userInfo.name ? userInfo.name : '新用戶1',
            email: userInfo.email
          })
        )
        authorizeCartAccess()
      } else {
        handleAlert('登入失敗')
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const signUp = async (values) => {
    try {
      console.log(values.email, values.password)
      const response = await fetch(
        'https://vue-course-api.hexschool.io/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: values.email,
            password: values.password,
            confirm_password: values.password
          })
        }
      )
      const data = await response.json()

      if (data.success) {
        handleAlert(data.message)
      } else if (data.code === 'auth/email-already-in-use') {
        handleAlert('註冊失敗，電子信箱或密碼已被註冊')
      } else {
        handleAlert('註冊失敗')
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const authorizeCartAccess = async () => {
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
            username: 'newandy1@gmail.com',
            password: `${process.env.REACT_APP_PASSWORD}`
          })
        }
      )
      const data = await response.json()
      authorize(data.token)
      dispatch(setToken(data.token))
    } catch (error) {
      console.error(error)
    }
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
          onSubmit={(values) => handleSubmit(isRegistered, values)}
        >
          <Form className="text-dark bg-beige px-5 py-3 rounded m-auto auth-card">
            <h3>{isRegistered ? '登入' : '註冊'}</h3>
            {isRegistered ? (
              <button
                type="button"
                className="custom-btn"
                onClick={() => {
                  setIsRegistered(false)
                }}
              >
                馬上註冊
              </button>
            ) : (
              <button
                type="button"
                className="custom-btn"
                onClick={() => {
                  setIsRegistered(true)
                }}
              >
                登入帳號
              </button>
            )}
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
            <div className="m-auto py-2 pe-3">
              {isRegistered && (
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    navigate('/products')
                    const userInfo = jwtDecode(credentialResponse.credential)
                    dispatch(
                      setCurrentUser({
                        id: userInfo.sub,
                        name: userInfo.name,
                        email: userInfo.email
                      })
                    )
                    authorizeCartAccess()
                  }}
                  onError={() => {
                    handleAlert('登入失敗')
                  }}
                />
              )}
            </div>
          </Form>
        </Formik>
      </Container>
      <Footer />
    </div>
  )
}

export default UserAuth
