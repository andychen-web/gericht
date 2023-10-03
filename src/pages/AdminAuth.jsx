import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { setAdminToken } from '../slices/tokenSlice'

const AdminAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [alertQueue, setAlertQueue] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const handleAlert = (message) => {
    setAlertQueue((prevQueue) => [...prevQueue, { message }])
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const signIn = async () => {
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
              username: email,
              password
            })
          }
        )
        const data = await response.json()
        if (data.success) {
          handleAlert('登入成功')
          if (
            email === `${process.env.REACT_APP_ADMIN_EMAIL}` &&
            password === `${process.env.REACT_APP_ADMIN_PASSWORD}`
          ) {
            dispatch(setAdminToken(data.token))
            setTimeout(() => navigate('/orders'), 1500)
          }
        } else if (!data.success) {
          handleAlert('登入失敗')
          setIsLoading(false)
        }
      } catch (error) {
        handleAlert('登入失敗')
        setIsLoading(false)
        console.log(error)
      }
    }
    signIn()
  }

  const autoFill = (e) => {
    if (e.target.checked) {
      setIsChecked(true)
      setEmail(process.env.REACT_APP_ADMIN_EMAIL)
      setPassword(process.env.REACT_APP_ADMIN_PASSWORD)
    } else {
      setIsChecked(false)
      setEmail('')
      setPassword('')
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
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="text-dark bg-beige px-5 py-3 rounded m-auto auth-card"
        >
          <h3>管理員登入</h3>
          <span className="text-danger fw-bold">限管理員操作</span>
          <div className="form-group pb-1 pt-3 custom-small-font">
            <label htmlFor="userEmail" className="h5">
              電子信箱
            </label>
            <input
              type="text"
              name="email"
              className="form-control form-control-sm custom-small-font"
              id="userEmail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setIsChecked(false)
              }}
              placeholder="請輸入電子郵件"
            />
          </div>
          <div className="form-group py-1  custom-small-font">
            <label htmlFor="password" className="h5">
              密碼
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="請輸入密碼"
              onChange={(e) => {
                setPassword(e.target.value)
                setIsChecked(false)
              }}
              value={password}
              className="form-control form-control-sm custom-small-font"
            />
          </div>
          <div>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => autoFill(e)}
              id="autoFill"
            />
            <label htmlFor="autoFill">自動填入</label>
          </div>
          <button type="submit" className="btn btn-dark mt-2">
            資料送出
          </button>
        </form>
        <Footer />
      </Container>
    </div>
  )
}

export default AdminAuth
