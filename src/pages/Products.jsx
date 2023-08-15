import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "../components/Footer";
import { BsFillCartFill } from "react-icons/bs";

const Products = () => {
  const [products, setProducts] = useState("");
  const [priceRange, setPriceRange] = useState("全部");
  const [category, setCategory] = useState("全部");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/products`,
          { method: "GET" }
        );
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handlePriceRangeChange = (e) => {
    setPriceRange(e.target.value);
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    console.log(category);
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

      // filter based on category
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

  // product as argument
  const token =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6InRCME0yQSJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS92dWUtY291cnNlLWFwaSIsImF1ZCI6InZ1ZS1jb3Vyc2UtYXBpIiwiYXV0aF90aW1lIjoxNjg2NjIxODk0LCJ1c2VyX2lkIjoiUER4ckxnNG9NUllWRjYwYWNCV0RWVFZ6MU9lMiIsInN1YiI6IlBEeHJMZzRvTVJZVkY2MGFjQldEVlRWejFPZTIiLCJpYXQiOjE2ODY2MjE4OTUsImV4cCI6MTY4NzA1Mzg5NSwiZW1haWwiOiJkenhjdjE5ODc0NTQ2NjcxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJkenhjdjE5ODc0NTQ2NjcxQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.Bdt1TBjSHVoEaDVji37rq2oqvJgIQ5yjUzBF5ZbjI-NP0apql6if1ZUlwBXZHeOZ45xCqQJhFxZgLKRKQnEY8-Vb1togP7PEtSHmM8nADwWLKQ9SIWNrt75nHkbuVl9tc_MBH3gZzasm-ALxSaxRDEYChUxodngKmaOzEgXQX527wNQSeicRgvbnjjYWaypDrC_IXwxgIQilPYy7wBz7SfklPzKz9MGkw-Vq5XD_pcxaX1O14ECDzbr-6aLPPRyHdk3oPlHFNKnkngL_j2abfE68yT23XtY3yaTXhaSh9mxOsCsZMKiHGNstVPpqJbqG-0nMGeVTLeRUe05Gd_YkEw";
  const addToCart = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await fetch(
        "https://vue3-course-api.hexschool.io/api/xiaochun/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: { product_id: "-testest", qty: 1 },
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
                  <>
                    <Col xs={8} sm={4} lg={3} className="text-white mx-2 mt-3 ">
                      <img
                        src={product.image}
                        className="menu-products rounded pb-2"
                        alt="menu-products"
                      />
                      <h5 style={{ width: "120%" }}>{product.title}</h5>
                      <div className="d-flex align-items-top">
                        <h5 className="pe-2">${product.price}</h5>
                        <BsFillCartFill
                          size={30}
                          className="custom-icon"
                          onClick={() => addToCart(product)}
                        ></BsFillCartFill>
                      </div>
                    </Col>
                  </>
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
