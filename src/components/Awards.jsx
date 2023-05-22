import React from "react";
import Container from "react-bootstrap/container";
import Row from "react-bootstrap/row";
import Col from "react-bootstrap/col";
import images from "../data/images";
import data from "../data/data";
import Title from "./Title";
const awards = data.awards;

const Awards = () => {
  return (
    <div className="bg-brown">
      <img className="ps-4 pt-4" width={"10%"} src={images.logo} alt="logo" />
      <Container className="py-5">
        <Row>
          <Col md={8} className="d-flex flex-column">
            <Title title={"獲獎"} subTitle={"美食指南獎項"} />
            <Row className={"pt-5"}>
              <Col>
                <>
                  {awards.map((item, index) => {
                    // Start a new row for every even item (0, 2, ...)
                    if (index % 2 === 0) {
                      return (
                        <Row key={index} className="py-3">
                          <Col xs={12} md={6} className="d-flex py-3">
                            <div>
                              <img
                                className="w-100"
                                src={item.imgUrl}
                                alt="award"
                              />
                            </div>
                            <div className="ps-3">
                              <span className="golden-text fs-4">
                                {awards[index].title}
                              </span>
                              <br />
                              <span className="fs-5 text-white fw-bold">
                                {awards[index].subtitle}
                              </span>
                            </div>
                          </Col>
                          {/* Check if there is a next item before rendering the second column */}
                          {awards[index + 1] && (
                            <Col xs={12} md={6} className="d-flex">
                              <div>
                                <img
                                  className="w-100"
                                  src={awards[index + 1].imgUrl}
                                  alt="award"
                                />
                              </div>
                              <div className="ps-3">
                                <span className="golden-text fs-4">
                                  {awards[index + 1].title}
                                </span>
                                <br />
                                <span className="fs-5 text-white fw-bold">
                                  {awards[index + 1].subtitle}
                                </span>
                              </div>
                            </Col>
                          )}
                        </Row>
                      );
                    }
                  })}
                </>
              </Col>
            </Row>
          </Col>
          <Col
            md={4}
            className="d-flex align-items-md-end justify-content-center"
          >
            <img className="laurels" src={images.laurels} alt="laurels" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Awards;
