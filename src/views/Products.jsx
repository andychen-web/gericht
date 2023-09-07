import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "../components/Footer";
import { BsFillCartFill } from "react-icons/bs";
import PropTypes from "prop-types";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Products = ({ products }) => {
  Products.propTypes = {
    products: PropTypes.array,
  };
  const navigate = useNavigate();
  const token = useSelector((state) => state.token.token);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [priceRange, setPriceRange] = useState("全部");
  const [category, setCategory] = useState("全部");
  const [updateCount, setUpdateCount] = useState(0);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const categoryTypes = ["全部", "燉飯", "義大利麵", "烤肉", "甜點"];
  const priceRangeArr = ["全部", "$99~$199", "$200~$399"];

  let alertMessage;
  const handleAddAlert = () => {
    setShowAddAlert(!showAddAlert);
  };
  const handleUpdateAlert = () => {
    setShowUpdateAlert(!showUpdateAlert);
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
    alertMessage = document.querySelector(".add-cart-alert");
    if (showAddAlert) {
      alertMessage.classList.remove("hidden");
      setTimeout(() => {
        setShowAddAlert(false);
      }, 2000);
    } else {
      alertMessage.classList.add("hidden");
    }
  }, [showAddAlert]);
  useEffect(() => {
    alertMessage = document.querySelector(".update-cart-alert");
    if (showUpdateAlert) {
      alertMessage.classList.remove("hidden");
      setTimeout(() => {
        setShowUpdateAlert(false);
      }, 2000);
    } else {
      alertMessage.classList.add("hidden");
    }
  }, [showUpdateAlert]);

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
    const duplicate = cartItems.filter(
      (item) => item.title === product.title
    )[0];
    if (duplicate) {
      try {
        const response = await fetch(
          `https://vue3-course-api.hexschool.io/v2/api/newcart1/admin/product/${duplicate.id}`,
          {
            method: "PUT",
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
                quantity: duplicate.quantity + 1,
                category: product.category,
                imageUrl: product.image,
              },
            }),
          }
        );
        const data = await response.json();
        setUpdateCount((prevState) => prevState + 1);
        if (data.success) {
          handleUpdateAlert();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
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
        setUpdateCount((prevState) => prevState + 1);
        if (data.success) {
          handleAddAlert();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="bg">
      <Loader isLoading={isLoading} />

      <Navigation updateCount={updateCount} />
      {/* feat to add:喜好清單 */}
      <div className=" position-fixed custom-top end-0 me-2">
        <div className="add-cart-alert alert alert-light mt-5 hidden">
          已加入購物車
          <button
            type="button"
            aria-label="close"
            className="close border-0"
            style={{ background: "#fefefe" }}
            onClick={() => handleAddAlert()}
          >
            x
          </button>
        </div>
        <div className="update-cart-alert alert alert-light  hidden">
          已更新購物車
          <button
            type="button"
            aria-label="close"
            className="close border-0"
            style={{ background: "#fefefe" }}
            onClick={() => handleUpdateAlert()}
          >
            x
          </button>
        </div>
      </div>
      <Container className="custom-padding-top">
        <Row>
          {/* 篩選品項 */}
          <Col md={3} className="custom-max-width">
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
