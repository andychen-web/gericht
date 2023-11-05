import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Title from '../pages/frontend/HomePage/components/Title'
import images from '../data/images'
import { RxTwitterLogo, RxInstagramLogo } from 'react-icons/rx'
import { FaFacebookF } from 'react-icons/fa'
import Loader from '../components/Loader'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const MySwal = withReactContent(Swal)
  const handleAlert = (message) => {
    MySwal.fire({
      title: <p className="fs-4">{message}</p>,
      timer: 1500
    })
  }
  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subscribeNewsletter = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('https://api.apilayer.com/form_api/form', {
          method: 'POST',
          redirect: 'follow',
          headers: { apikey: process.env.REACT_APP_NEWSLETTER_API_KEY },
          body: JSON.stringify({ email })
        })
        const data = await res.json()
        if (data) {
          setEmail('')
          handleAlert('訂閱成功 已收到您的Email😄')
        }
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    }
    subscribeNewsletter()
  }

  return (
    <footer className="bg pt-5 pb-2">
      <Loader isLoading={isLoading} />
      <Container>
        <Row className="d-center">
          <Col
            xs={10}
            className="d-flex flex-column align-items-center border-5 border-white "
          >
            <Title title={'電子報'} subTitle={'訂閱電子報'} />
            <span className="text-white py-3">永遠不會錯過最新消息</span>
            <Form className="d-flex bg-black" onSubmit={handleSubmit}>
              <input
                type="email"
                className="bg-black border-white rounded text-white p-2 w-75"
                placeholder="Enter email"
                aria-label="Email adress"
                onChange={handleChange}
                id="formInput"
                value={email}
              />
              <button className="custom-btn ms-3 w-25" type="submit">
                訂閱
              </button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="d-center">
            <div className="text-white pt-3 pt-md-0">
              <div className="fs-3 custom-text">聯絡我們</div>
              <div>新竹市東區美食路33號</div>
              <div>+1 212-344-1230</div>
              <div>+1 212-555-1230</div>
            </div>
          </Col>
          <Col md={4} className="d-flex flex-column align-items-center py-5">
            <img
              loading="lazy"
              width={'60%'}
              src={images.gericht}
              alt="logo"
              style={{ filter: 'sepia(1) hue-rotate(-50deg) saturate(10)' }}
            />
            <div className="text-white">「在服務他人的過程中，找到自己。」</div>
            <img loading="lazy" src={images.spoon} alt="spoon" />
            <div>
              <FaFacebookF className="custom-icon" />
              <RxTwitterLogo className="mx-3 custom-icon" />
              <RxInstagramLogo className="custom-icon" />
            </div>
          </Col>
          <Col
            md={4}
            className="d-flex text-white flex-column align-items-center"
          >
            <div>
              <div className="fs-3 custom-text">營業時間</div>
              <div>平日 08:00am -12:00am</div>
              <div>假日 07:00am -11:00pm </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
