import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import images from "../data/images";
import Title from "./Title";

const Contact = () => {
  return (
    <div className="bg py-5" id="contact-us">
      <Container>
        <Row>
          <Col xs={12} md={6} className="d-center flex-column py-4 hidden">
            <Title title={"聯絡資訊"} subTitle={"聯絡我們"} />
            <h5 className="text-white py-3">新竹市東區美食路33號</h5>
            <span className="golden-text fs-3"> 營業時間</span>
            <span className="text-white">Mon - Fri: 10:00 am - 02:00 am</span>
            <span className="text-white">Sat - Sun: 10:00 am - 03:00 am</span>
          </Col>
          <Col xs={12} md={6}>
            <img
              loading="lazy"
              width={"90%"}
              src={images.findus}
              alt="findUs"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
