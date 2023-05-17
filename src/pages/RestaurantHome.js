import React from "react";
import Nav from "react-bootstrap/nav";
import Navbar from "react-bootstrap/navbar";

import "bootstrap/dist/css/bootstrap.min.css";

const RestaurantHome = () => {
  return (
    <Navbar bg="black" expand="lg" variant="dark">
      <div className="container">
        <Navbar.Brand href="#">Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">About</Nav.Link>
            <Nav.Link href="#">Services</Nav.Link>
            <Nav.Link href="#">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default RestaurantHome;
