import React from "react";
import images from "../data/images";
import Nav from "react-bootstrap/nav";
import Navbar from "react-bootstrap/navbar";

const Navigation = () => {
  return (
    <Navbar bg="black" expand="lg" variant="dark">
      <div className="container">
        <Navbar.Brand className="w-50" href="/">
          <img src={images.gericht} alt="" style={{ maxWidth: "12vw" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className=" ml-auto">
            <Nav.Link className="customLink" href="#">
              首頁
            </Nav.Link>
            <Nav.Link className="customLink" href="#">
              聯絡我們
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Navigation;
