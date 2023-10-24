import { GoogleLogin } from '@react-oauth/google'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import jwtDecode from 'jwt-decode'
import React, { useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import Loader from '../../components/Loader'
import { setAdminToken, setUserToken } from '../../slices/tokenSlice'
import { setCurrentUser } from '../../slices/userSlice'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const UserAuth = () => {
  const MySwal = withReactContent(Swal)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
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
    MySwal.fire({
      title: <p className="fs-4">{message}</p>,
      timer: 1500
    })
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
      const response = await fetch(`${process.env.REACT_APP_API}admin/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: values.email,
          password: values.password
        })
      })
      const data = await response.json()
      if (data.success) {
        handleAlert('登入成功')
        setTimeout(() => navigate('/products'), 1500)
        const userInfo = jwtDecode(data.token)
        dispatch(
          setCurrentUser({
            id: userInfo.sub,
            name: userInfo.name ? userInfo.name : '新用戶',
            email: userInfo.email,
            exp: userInfo.exp
          })
        )
        authorizeCartAccess()
        dispatch(setAdminToken(null))
      } else {
        handleAlert('登入失敗')
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const signUp = async (values) => {
    setIsLoading(true)
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
    setIsLoading(false)
  }

  const authorizeCartAccess = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}admin/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'newandy1@gmail.com',
          password: `${process.env.REACT_APP_PASSWORD}`
        })
      })
      const data = await response.json()
      authorize(data.token)
      dispatch(setUserToken(data.token))
    } catch (error) {
      console.error(error)
    }
  }

  const authorize = async (token) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API}api/user/check`, {
        method: 'POST',
        headers: { Authorization: token }
      })
      // eslint-disable-next-line no-unused-vars
      const data = await res.json()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <main className="bg">
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
            <div className="form-group custom-small-font">
              <label htmlFor="userEmail" className="h5">
                電子信箱
              </label>
              <Field
                type="text"
                name="email"
                className="form-control form-control-sm custom-small-font"
                id="userEmail"
                autoComplete="off"
                placeholder="請輸入電子郵件"
              />
              <ErrorMessage
                name="email"
                component="span"
                className="text-danger custom-small-font"
              />
            </div>
            <div className="form-group custom-small-font">
              <label htmlFor="password" className="h5">
                密碼
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                autoComplete="off"
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
            <div className="m-auto py-2 pe-3 google-auth-wrap">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  navigate('/products')
                  const userInfo = jwtDecode(credentialResponse.credential)
                  dispatch(
                    setCurrentUser({
                      id: userInfo.sub,
                      name: userInfo.name,
                      email: userInfo.email,
                      exp: userInfo.exp
                    })
                  )
                  authorizeCartAccess()
                }}
                onError={() => {
                  handleAlert('登入失敗')
                }}
              />
            </div>
          </Form>
        </Formik>
      </Container>
    </main>
  )
}

export default UserAuth
