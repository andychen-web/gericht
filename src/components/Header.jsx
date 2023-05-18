import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import images from "../data/images";

const Header = () => {
  return (
    <div
      className="bg"
    >
      <Container className="py-5">
        <Row>
          <Col
            xs={12}
            md={6}
            className="d-flex flex-column justify-content-center"
          >
            <h2 className="text-capitalize text-white">追尋新風味</h2>
            <img height={"auto"} width={"40px"} src={images.spoon} alt="" />
            <span className="text-capitalize fw-bold custom-text fs-1">
              探索精緻飲食
            </span>
            <h5 className="text-white py-1">
              品味創意菜餚，沉浸於令人心馳神往的味覺饗宴，彷彿探險家在未知的味道中遨遊
            </h5>
            <button className="custom-btn">菜單</button>
          </Col>
          <Col xs={12} md={6}>
            <img width={"100%"} src={images.welcome} alt="welcome" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Header;
