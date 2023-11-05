import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import images from '../../../../data/images'
import Title from './Title'
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

const Gallery = () => {
  const scrollRef = React.useRef(null)
  const navigate = useNavigate()

  const scroll = (direction) => {
    // get current element that scrollRef is attached to
    const { current } = scrollRef
    if (direction === 'left') {
      current.scrollLeft -= 260
    } else {
      current.scrollLeft += 260
    }
  }

  return (
    <div className="bg-black">
      <Container>
        <Row className="d-flex align-items-center">
          <Col xs={10} md={4} className="d-flex flex-column py-5">
            <Title title={'相片'} subTitle={'美食相簿'} />
            <span className="text-white py-3">美味風情，一睹為快</span>
            <button
              className="custom-btn"
              onClick={() => navigate('/products')}
            >
              了解產品
            </button>
          </Col>
          <Col
            ref={scrollRef}
            xs={12}
            md={8}
            className="gallery d-flex overflow-hidden align-items-end justify-content-start"
          >
            {[
              images.gallery01,
              images.gallery02,
              images.gallery03,
              images.gallery04,
              images.gallery01,
              images.gallery02
            ].map((item, index) => (
              <div key={index} className="px-1">
                <img
                  loading="lazy"
                  style={{
                    width: '12rem',
                    height: '17rem',
                    objectFit: 'cover'
                  }}
                  src={item}
                  alt="gallery01"
                />
              </div>
            ))}
            <BsFillCaretLeftFill
              onClick={() => scroll('left')}
              style={{ right: '37%' }}
              className="text-white scrollbar position-absolute me-5 fs-1"
            />
            <BsFillCaretRightFill
              onClick={() => scroll('right')}
              style={{ right: '27%' }}
              className="text-white scrollbar position-absolute ms-5 fs-1"
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Gallery
