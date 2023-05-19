import React from "react";
import Container from "react-bootstrap/container";
import Row from "react-bootstrap/row";
import Col from "react-bootstrap/col";
import images from "../data/images";
import Title from "./Title";

const Header = () => {
  return (
    <div className="bg">
      <Container className="py-5">
        <Row>
          <Col
            xs={12}
            md={6}
            className="d-flex flex-column justify-content-center"
          >
            <Title title={"追尋新風味"} subTitle={"探索精緻飲食"} />
            <h5 className="text-white py-4 w-75">
              品嘗菜餚，享受令人嚮往的味覺饗宴
              <br /> 彷彿探險家在未知的味道中遨遊
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
