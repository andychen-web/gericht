import React, { useState } from "react";
import Navigation from "../components/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "../components/Footer";
import { BsFillCartFill } from "react-icons/bs";
import PropTypes from "prop-types";

const Products = ({ token, products }) => {
  Products.propTypes = {
    token: PropTypes.string,
    products: PropTypes.array,
  };

  const [priceRange, setPriceRange] = useState("全部");
  const [category, setCategory] = useState("全部");

  const handlePriceRangeChange = (e) => {
    setPriceRange(e.target.value);
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const filterdProducts =
    products &&
    products.filter((product) => {
      let priceMatch = false;
      if (priceRange === "全部") {
        priceMatch = true;
      } else if (priceRange === "$99~$199") {
        priceMatch = product.price >= 99 && product.price <= 199;
      } else if (priceRange === "$200~$399") {
        priceMatch = product.price >= 200 && product.price <= 399;
      }

      let categoryMatch = false;
      if (category === "全部") {
        categoryMatch = true;
      } else if (category === "燉飯") {
        categoryMatch = product.category === "燉飯";
      } else if (category === "義大利麵") {
        categoryMatch = product.category === "義大利麵";
      } else if (category === "披薩") {
        categoryMatch = product.category === "披薩";
      } else if (category === "烤肉") {
        categoryMatch = product.category === "烤肉";
      } else if (category === "甜點") {
        categoryMatch = product.category === "甜點";
      }

      // return products that match both filters
      return priceMatch && categoryMatch;
    });

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
              quantity: product.quantity,
              category: product.category,
              imageUrl: product.image,
            },
          }),
        }
      );
      const data = await response.json();
      console.log("data", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg">
      <Navigation />
      <Container style={{ paddingTop: "7rem" }}>
        <Row>
          {/* 篩選品項 */}
          <Col md={2}>
            <form className="text-white">
              <div className="form-group pb-3">
                <label htmlFor="formCategory" className="h5">
                  種類
                </label>
                <select
                  className="form-control"
                  id="formCategory"
                  onChange={handleCategoryChange}
                >
                  <option>全部</option>
                  <option>燉飯</option>
                  <option>披薩</option>
                  <option>義大利麵</option>
                  <option>烤肉</option>
                  <option>甜點</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="formPriceRange" className="h5">
                  價格區間
                </label>
                <select
                  className="form-control"
                  id="formPriceRange"
                  onChange={handlePriceRangeChange}
                >
                  <option>全部</option>
                  <option>$99~$199</option>
                  <option>$200~$399</option>
                </select>
              </div>
            </form>
          </Col>
          {/* 展示品項*/}
          <Col md={10}>
            <Row className="gap-5">
              {filterdProducts &&
                filterdProducts.map((product) => (
                  <Col
                    key={product.id}
                    xs={8}
                    sm={4}
                    lg={3}
                    className="text-white mx-2 mt-3 "
                  >
                    <img
                      src={product.image}
                      className="menu-products rounded pb-2"
                      alt="menu-products"
                    />
                    <h5 style={{ width: "120%" }}>{product.title}</h5>
                    <div className="d-flex align-items-top">
                      <h5 className="pe-2">${product.price}</h5>
                      <BsFillCartFill
                        size={20}
                        className="custom-icon"
                        onClick={() => addToCart(product)}
                      ></BsFillCartFill>
                    </div>
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Products;
