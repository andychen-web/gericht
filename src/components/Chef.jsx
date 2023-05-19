import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import images from "../data/images";

const Chef = () => {
  return (
    <div className="bg-brown">
      <Container className="py-5">
        <Row >
          <Col xs={12} md={6}>
            <img width={"100%"} src={images.chef} alt="chef" />
          </Col>
          <Col
            xs={12}
            md={6}
            className="d-flex flex-column justify-content-center ps-5"
          >
            <h4 className="text-white">主廚理念</h4>
            <img height={"auto"} width={"40px"} src={images.spoon} alt="" />
            <span className="fw-bold custom-text fs-1">我們的堅持</span>
            <div className="py-4">
              <img src={images.quote} width={"9%"} alt="quote" />
              <h5 className="text-white py-1">
                頂級有機美食、極致饗宴、優雅品味、盡現饕客餐桌品味細緻、兼顧營養、味蕾與自然的美妙邂逅體驗與眾不同的Fine
                Dining之旅
              </h5>
            </div>
            <span className="fw-bold signature-text">Kevin Luo</span>
            <h5 className="text-white py-1">主廚兼創辦人 </h5>
            <img src={images.sign} width={"45%"} alt="sign" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Chef;
