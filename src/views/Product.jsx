import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "../components/Footer";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Product = ({ token, product, products }) => {
  Product.propTypes = {
    token: PropTypes.string,
    product: PropTypes.object,
    products: PropTypes.array,
  };
  const relatedProducts = products.filter(
    (item) => item.category === product.category
  );
  const uniqueRelatedProducts = relatedProducts.filter(
    (item) => item.id !== product.id
  );

  const [quantity, setQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleAlert = () => {
    setShowAlert(!showAlert);
  };
  useEffect(() => {
    const alertMessage = document.querySelector(".message-alert");
    if (showAlert) {
      alertMessage.classList.remove("hidden");
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } else {
      alertMessage.classList.add("hidden");
    }
  }, [showAlert]);

  const addToCart = async (product) => {
    try {
      const response = await fetch(
        "https://vue3-course-api.hexschool.io/v2/api/newcart1/admin/product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },

          body: JSON.stringify({
            data: {
              title: product.title,
              origin_price: product.origin_price,
              price: product.price,
              unit: product.unit,
              quantity: quantity,
              category: product.category,
              imageUrl: product.image,
            },
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg">
      <Navigation />
      <div className=" position-fixed top-25 end-0 ">
        <div className="message-alert alert alert-light pt-5 mt-5 hidden">
          已加入購物車
          <button
            type="button"
            aria-label="close"
            className="close border-0"
            style={{ background: "#fefefe" }}
            onClick={() => handleAlert()}
          >
            x
          </button>
        </div>
      </div>
      <Container className="custom-padding-top">
        <Row>
          <Col xs={12} md={8} lg={8} className="product-img-wrap">
            <img
              src={product.image}
              className="product-img rounded obj-contain"
              alt={product.title}
            />
          </Col>
          <Col
            xs={6}
            md={3}
            lg={3}
            className="product-card h-75 text-dark mt-3 py-3 bg-beige rounded d-flex flex-column"
          >
            <h4>{product.title}</h4>
            <div className="custom-small-font">【Gericht季節特選】</div>
            <div className="pt-3">
              <s> 原價 {product.origin_price}</s>
            </div>
            <div>
              <span className="text-danger fw-bold h5">
                特價 NT${product.price}
              </span>
            </div>
            <div className="d-flex">
              <div className="btn-group bg-white">
                <button
                  onClick={() =>
                    setQuantity((prevState) =>
                      prevState > 1 ? prevState - 1 : prevState
                    )
                  }
                  type="button"
                  className="btn btn-outline-secondary text-dark"
                >
                  -
                </button>
                <button
                  disabled="disabled"
                  className="btn btn-outline-secondary text-dark"
                >
                  {quantity}
                </button>
                <button
                  onClick={() => setQuantity((prevState) => prevState + 1)}
                  type="button"
                  className="btn btn-outline-secondary"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                addToCart(product);
                handleAlert();
              }}
              className="custom-btn my-3"
            >
              加入購物車
            </button>
          </Col>
        </Row>
        <Col md={9} lg={7} className="text-left mt-3 m-auto">
          <pre className="custom-small-font bg-beige px-5 py-3 rounded">
            <h5>商品描述</h5>
            {product.description}
            <p className="text-muted">***溫馨提醒：所有產品須冷藏***</p>
          </pre>
        </Col>
        <Col md={9} lg={7} className="text-left mt-3 m-auto">
          <div className="bg-beige px-5 py-3 rounded">
            <h5> 類似商品</h5>
            <Row>
              {uniqueRelatedProducts &&
                uniqueRelatedProducts.map((product) => (
                  <Col key={product.id} md={4} xs={4} className="mb-4">
                    <img
                      width={"95%"}
                      className="rounded cursor-pointer"
                      src={product.image}
                      alt={product.title}
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                    <p className="">{product.title}</p>
                  </Col>
                ))}
            </Row>
          </div>
        </Col>
      </Container>
      <Footer />
    </div>
  );
};

export default Product;
