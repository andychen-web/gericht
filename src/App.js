import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/custom.css";
import Navigation from "./components/Navbar";
import Header from "./components/Header";
import AboutUs from "./components/AboutUs";
import Menu from "./components/Menu";
import Chef from "./components/Chef";

function App() {
  return (
    <>
      <Navigation />
      <Header />
      <AboutUs></AboutUs>
      <Menu />
      <Chef />
    </>
  );
}
export default App;
