import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import images from '../../../../data/images'
import Title from './Title'

const Chef = () => {
  return (
    <div className="bg-brown">
      <Container className="py-5">
        <Row>
          <Col xs={12} md={5}>
            <div className="blur-load chef-blur rounded">
              <img
                width={'100%'}
                src={images.chef}
                className="rounded"
                alt="chef"
              />
            </div>
          </Col>
          <Col xs={12} md={6} className="flex-column d-center ps-5 mt-3 hidden">
            <Title title={'主廚理念'} subTitle={'我們的堅持'}></Title>
            <div className="py-sm-1 py-md-4">
              <img src={images.quote} loading="lazy" width={'9%'} alt="quote" />
              <h5 className="text-white py-1">
                頂級有機美食、極致饗宴、優雅品味、盡現饕客餐桌品味細緻、兼顧營養、味蕾與自然的美妙邂逅體驗與眾不同的Fine
                Dining之旅
              </h5>
            </div>
            <span className="fw-bold signature-text">Kevin Luo</span>
            <h5 className="text-white py-1">主廚兼創辦人 </h5>
            <img src={images.sign} loading="lazy" width={'45%'} alt="sign" />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Chef
