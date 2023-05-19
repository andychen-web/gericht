import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/custom.css";
import Navigation from "./components/Navbar";
import Header from "./components/Header";
import AboutUs from "./components/AboutUs";
import Menu from "./components/Menu";
import Chef from "./components/Chef";
import IntroVideo from "./components/IntroVideo";
import Awards from "./components/Awards";

function App() {
  return (
    <>
      <Navigation />
      <Header />
      <AboutUs />
      <Menu />
      <Chef />
      <IntroVideo />
      <Awards />
    </>
  );
}
export default App;
