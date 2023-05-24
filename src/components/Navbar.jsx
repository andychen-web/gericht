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
      <div
        className="container-fluid "
        style={{ width: "100vw" }}
      >
        <Navbar.Brand className="w-50" href="/">
          <img src={images.gericht} alt="logo" className="w-50" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="">
            <Nav.Link className="custom-link" href="#header">
              首頁
            </Nav.Link>
            <Nav.Link className="custom-link" href="#about-us">
              關於我們
            </Nav.Link>
            <Nav.Link className="custom-link" href="#menu">
              菜單
            </Nav.Link>
            <Nav.Link className="custom-link" href="#chef">
              認識主廚
            </Nav.Link>
            <Nav.Link className="custom-link" href="#awards">
              獲獎
            </Nav.Link>
            <Nav.Link className="custom-link" href="#contact-us">
              聯絡我們
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Navigation;
