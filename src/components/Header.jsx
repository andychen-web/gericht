import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import images from "../data/images";
import Title from "./Title";
import { useNavigate } from "react-router";
import Loader from "../components/Loader";

const Header = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = () => {
    navigate("/products");
  };
  const blurDivs = document.querySelectorAll(".blur-load");
  blurDivs.forEach((div) => {
    const img = div.querySelector("img");

    function loaded() {
      div.classList.add("loaded");
      // setIsLoading(false);
      console.log(isLoading, setIsLoading);
    }

    if (img.complete) {
      loaded();
    } else {
      img.addEventListener("load", loaded);
    }
  });

  return (
    <div className="bg ">
      <Loader isLoading={isLoading} />
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
            <div className="blur-load welcome-blur w-75 rounded">
              <img
                width={"100%"}
                className="loaded-img rounded"
                src={images.welcome}
                alt="welcome"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Header;
