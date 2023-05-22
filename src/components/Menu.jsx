import React from "react";
import Container from "react-bootstrap/container";
import Row from "react-bootstrap/row";
import Col from "react-bootstrap/col";
import images from "../data/images";
import data from "../data/data";
import Title from "./Title";
const wines = data.wines;
const cocktails = data.cocktails;

const Menu = () => {
  return (
    <div className="bg-black" id="menu">
      <Container className="py-5 d-flex flex-column align-items-center">
        <Row xs={12} md={12}>
          <Col className="d-flex flex-column align-items-center justify-content-center">
            <Title title={"挑動味蕾"} subTitle={"近期菜單"} />
          </Col>
        </Row>
        <Row md={12}>
          <Col md={4} className="fs-2 text-white fw-bold">
            <Row className="ps-2">葡萄酒與啤酒</Row>
            {wines.map((item, key) => (
              <>
                <Row key={key} className="d-flex align-items-center">
                  <Col xs={7} md={8} className="py-2">
                    <div className="fs-4 golden-text">{item.title}</div>
                  </Col>
                  <Col xs={3} md={2} className="white-line"></Col>
                  <Col xs={2} md={2} className="golden-text">
                    {item.price}
                  </Col>
                </Row>
                <Row>
                  <div className="fs-6">{item.tags}</div>
                </Row>
              </>
            ))}
          </Col>
          <Col xs={12} md={4} className="py-2">
            <img width={"100%"} src={images.menu} alt="menuImg" />
          </Col>
          <Col md={4} className="fs-2 text-white fw-bold">
            雞尾酒
            {cocktails.map((item, key) => (
              <>
                <Row key={key} className="d-flex align-items-center">
                  <Col xs={7} md={8} className="py-2">
                    <div className="fs-4 golden-text">{item.title}</div>
                  </Col>
                  <Col xs={3} md={2} className="white-line"></Col>
                  <Col xs={2} md={2} className="golden-text">
                    {item.price}
                  </Col>
                </Row>
                <Row>
                  <div className="fs-6">{item.tags}</div>
                </Row>
              </>
            ))}
          </Col>
        </Row>
        <button className="custom-btn mt-4">了解更多</button>
      </Container>
    </div>
  );
};

export default Menu;
