import React from "react";
import images from "../data/images";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const Navigation = () => {
  return (
    <Navbar
      bg="black"
      expand="lg"
      variant="dark"
      className="position-fixed overflow-hidden px-5"
      style={{ zIndex: 3, width: "100vw" }}
    >
      <Container fluid>
        <Navbar.Brand href="/">
          <img src={images.gericht} alt="logo" className="w-50" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto pe-5">
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
      </Container>
    </Navbar>
  );
};

export default Navigation;
