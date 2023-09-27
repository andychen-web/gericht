import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { setAdminToken } from '../slices/tokenSlice'
import { useDispatch } from 'react-redux'

const Auth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
  const handleSubmit = (values) => {
    signIn(values)
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
        navigate('/orders')
        dispatch(setAdminToken(data.token))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="bg">
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
                type="text"
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
