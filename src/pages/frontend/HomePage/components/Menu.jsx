import React from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import data from '../../../../data/data'
import images from '../../../../data/images'
import Title from './Title'
const wines = data.wines
const cocktails = data.cocktails

const Menu = () => {
  return (
    <div className="bg">
      <Container className="py-5 d-flex flex-column align-items-center">
        <Row xs={12} md={12} className="pb-3">
          <Col className="d-center flex-column align-items-center">
            <Title title={'挑動味蕾'} subTitle={'近期酒單'} />
          </Col>
        </Row>
        <Row md={12} className="d-flex">
          <Col md={4} className="fs-2 text-white ">
            <Row className="ps-2">葡萄酒與啤酒</Row>
            {wines.map((item, key) => (
              <div key={key}>
                <Row className="d-flex align-items-center">
                  <Col xs={7} md={8} className="py-2">
                    <div className="fs-4 special-text">{item.title}</div>
                  </Col>
                  <Col xs={3} md={2} className="white-line"></Col>
                  <Col xs={2} md={2} className="special-text">
                    {item.price}
                  </Col>
                </Row>
                <Row>
                  <div className="fs-6">{item.tags}</div>
                </Row>
              </div>
            ))}
          </Col>
          <Col xs={8} md={4} className="py-2 hidden">
            <img
              width={'100%'}
              loading="lazy"
              src={images.menu}
              alt="menuImg"
            />
          </Col>
          <Col md={4} className="fs-2 text-white ">
            雞尾酒
            {cocktails.map((item, key) => (
              <div key={key}>
                <Row className="d-flex align-items-center">
                  <Col xs={7} md={8} className="py-2">
                    <div className="fs-4 special-text">{item.title}</div>
                  </Col>
                  <Col xs={3} md={2} className="white-line"></Col>
                  <Col xs={2} md={2} className="special-text">
                    {item.price}
                  </Col>
                </Row>
                <Row>
                  <div className="fs-6">{item.tags}</div>
                </Row>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Menu
