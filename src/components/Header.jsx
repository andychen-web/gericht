import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import images from "../data/images";
import Title from "./Title";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/products");
  };

  return (
    <div className="bg" id="header">
      <Container className="pb-5 custom-padding-top">
        <Row>
          <Col xs={12} md={6} className="d-center flex-column">
            <Title title={"追尋新風味"} subTitle={"探索精緻飲食"} />
            <h5 className="text-white py-4 pe-3 w-75">
              品嘗菜餚，享受令人嚮往的味覺饗宴， 彷彿探險家在未知的味道中遨遊
            </h5>
            <button className="custom-btn mb-5" onClick={handleNavigate}>
              菜單
            </button>
          </Col>
          <Col xs={12} md={6}>
            <img
              width={"80%"}
              className=""
              src={images.welcome}
              alt="welcome"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Header;
