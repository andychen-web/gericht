import React from "react";
import images from "../data/images";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
const Navigation = () => {
  return (
    <Navbar
      bg="black"
      expand="lg"
      variant="dark"
      className="position-fixed"
      style={{ zIndex: 3, width: "100vw", marginBottom: "5rem" }}
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
