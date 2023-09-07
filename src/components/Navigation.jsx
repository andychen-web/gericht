import React, { useEffect } from "react";
import images from "../data/images";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { setItems } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

const Navigation = ({ updateCount }) => {
  Navigation.propTypes = {
    updateCount: PropTypes.number,
  };

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token.token);
  let cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    const fetchCart = async (token) => {
      try {
        const response = await fetch(
          "https://vue3-course-api.hexschool.io/v2/api/newcart1/admin/products/all",
          {
            headers: { Authorization: token },
            method: "GET",
          }
        );
        const data = await response.json();
        const newCartItems = [];
        for (let key in data.products) {
          newCartItems.push(data.products[key]);
        }
        const combinedCartItems = newCartItems.reduce((acc, item) => {
          const existingItem = acc.find((i) => i.title === item.title);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            acc.push({ ...item });
          }
          return acc;
        }, []);
        dispatch(setItems(combinedCartItems));
      } catch (error) {
        console.log(error);
      }
    };
    fetchCart(token);
  }, [token, updateCount]);

  return (
    <Navbar
      bg="black"
      expand="lg"
      variant="dark"
      className="position-fixed custom-nav"
    >
      <Container className="d-flex">
        <Navbar.Brand href="/" className="w-50">
          <img src={images.gericht} alt="logo" width={"40%"} />
        </Navbar.Brand>
        {/*創建一個可collapse的toggle btn，aria-controls代表要控制的Navbar.Collapse的id */}
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav" className="justify-content-end">
          <Nav>
            <Link className="custom-link nav-link" to="/">
              首頁
            </Link>
            <Link className="custom-link nav-link" to="/products">
              產品列表
            </Link>
            <Link className="custom-link nav-link" to="/cart">
              購物車
              <span className="badge badge-danger">
                {cartItems.length === 0 ? null : cartItems.length}
              </span>
            </Link>
            <Link className="custom-link nav-link" to="/orders">
              訂單查詢
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
