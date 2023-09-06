import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "../components/Footer";
import { BsFillCartFill } from "react-icons/bs";
import PropTypes from "prop-types";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
const Products = ({ token, products }) => {
  Products.propTypes = {
    token: PropTypes.string,
    products: PropTypes.array,
  };
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState("全部");
  const [category, setCategory] = useState("全部");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const categoryTypes = ["全部", "燉飯", "義大利麵", "烤肉", "甜點"];
  const priceRangeArr = ["全部", "$99~$199", "$200~$399"];

  let alertMessage;
  const handleAlert = () => {
    setShowAlert(!showAlert);
  };
  useEffect(() => {
    window.scrollTo(0, 0);

    if (products) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [products]);
  useEffect(() => {
    alertMessage = document.querySelector(".message-alert");
    if (showAlert) {
      alertMessage.classList.remove("hidden");
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } else {
      alertMessage.classList.add("hidden");
    }
  }, [showAlert]);

  const handlePriceRangeChange = (e) => {
    const priceDivs = document.querySelectorAll(".price-range");
    priceDivs.forEach((div) => div.classList.remove("clicked"));
    setPriceRange(e.target.innerHTML);
    e.target.classList.add("clicked");
  };
  const handleCategoryChange = (e) => {
    const categoryDivs = document.querySelectorAll(".category");
    categoryDivs.forEach((div) => div.classList.remove("clicked"));
    setCategory(e.target.innerHTML);
    e.target.classList.add("clicked");
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
      <Loader isLoading={isLoading} />

      <Navigation />
      {/* feat to add:喜好清單 */}
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
          {/* 篩選品項 */}
          <Col md={3}>
            <label className="h3 special-text fw-bold">種類</label>
            <ul className="category-wrap bg-dark list-unstyled border">
              {categoryTypes.map((categoryType, key) => (
                <li key={key}>
                  <div
                    className="category text-center ps-2 py-1 py-lg-2 cursor-pointer"
                    onClick={(event) => handleCategoryChange(event)}
                  >
                    {categoryType}
                  </div>
                </li>
              ))}
            </ul>

            <label className="h3 special-text fw-bold">價格區間</label>
            <ul className="bg-dark list-unstyled border">
              {priceRangeArr.map((priceRange, key) => (
                <li key={key}>
                  <div
                    className="price-range text-center ps-2 py-1 py-lg-2 cursor-pointer"
                    onClick={(event) => handlePriceRangeChange(event)}
                  >
                    {priceRange}
                  </div>
                </li>
              ))}
            </ul>
          </Col>
          {/* 展示品項*/}
          <Col md={9}>
            <Row className="gap-5">
              {filterdProducts &&
                filterdProducts.map((product, key) => (
                  <Col
                    key={key}
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
                    <div>{product.title}</div>
                    <div className="d-flex">
                      <h5 className="pe-2">${product.price}</h5>
                      <BsFillCartFill
                        size={20}
                        className="custom-icon"
                        onClick={() => {
                          addToCart(product);
                          handleAlert();
                        }}
                      />
                    </div>
                    <button
                      className="custom-btn"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      查看更多
                    </button>
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
