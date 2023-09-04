import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import images from "../data/images";
import data from "../data/data";
import Title from "./Title";
const awards = data.awards;

const Awards = () => {
  return (
    <div className="bg-brown">
      <Container className="py-5 hidden" id="awards">
        <img
          className="ps-4 pb-5"
          width={"150px"}
          loading="lazy"
          src={images.logo}
          alt="logo"
        />

        <Row>
          <Col lg={8} md={7} className="d-flex flex-column">
            <Title title={"獲獎"} subTitle={"美食指南獎項"} />
            <Row className={"pt-5"}>
              <Col>
                <>
                  {awards.map((item, index) => {
                    // Start a new row for every even item (0, 2, ...)
                    if (index % 2 === 0) {
                      return (
                        <Row key={index}>
                          <Col xs={12} xl={6} className="d-flex py-3">
                            <div>
                              <img
                                className="w-100"
                                src={item.imgUrl}
                                loading="lazy"
                                alt="award"
                              />
                            </div>
                            <div className="ps-3">
                              <span className="golden-text fs-4">
                                {awards[index].title}
                              </span>
                              <br />
                              <span className="fs-5 text-white">
                                {awards[index].subtitle}
                              </span>
                            </div>
                          </Col>
                          {/* Check if there is a next item before rendering the second column */}
                          {awards[index + 1] && (
                            <Col xs={12} xl={6} className="d-flex py-3">
                              <div>
                                <img
                                  className="w-100"
                                  src={awards[index + 1].imgUrl}
                                  loading="lazy"
                                  alt="award"
                                />
                              </div>
                              <div className="ps-3">
                                <span className="golden-text fs-4">
                                  {awards[index + 1].title}
                                </span>
                                <br />
                                <span className="fs-5 text-white">
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
          <Col lg={4} md={5} className="align-items-md-end d-center">
            <img
              className="laurels"
              src={images.laurels}
              alt="laurels"
              loading="lazy"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Awards;
