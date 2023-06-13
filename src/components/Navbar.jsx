import React from "react";
import images from "../data/images";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const Navigation = () => {
  return (
    <Navbar
      bg="black"
      expand="lg"
      variant="dark"
      className="position-fixed overflow-hidden"
      style={{ zIndex: 3 }}
    >
      <div className="container-fluid" style={{ width: "100vw" }}>
        <Navbar.Brand className="w-50" href="/">
          <img src={images.gericht} alt="logo" className="w-50" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse
          id="navbarNav"
        >
          <Nav className="ps-5 ms-5">
            <Nav.Link className="custom-link" href="/">
              首頁
            </Nav.Link>
            <Nav.Link className="custom-link" href="/products">
              產品列表
            </Nav.Link>
            <Nav.Link className="custom-link" href="/cart">
              購物車
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Navigation;
