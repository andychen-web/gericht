import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/custom.css";
import Navigation from "./components/Navbar";
import Header from "./components/Header";
import AboutUs from "./components/AboutUs";
import Menu from "./components/Menu";
import Chef from "./components/Chef";
import IntroVideo from "./components/IntroVideo";
import Awards from "./components/Awards";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  // animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show");
        }
      });
    });
    const hiddenElements = document.querySelectorAll(".hidden");

    hiddenElements.forEach((element) => {
      observer.observe(element);
    });
  }, []);

  return (
    <>
      <Navigation />
      <Header />
      <AboutUs />
      <Menu />
      <Chef />
      <IntroVideo />
      <Awards />
      <Gallery />
      <Contact />
      <Footer />
    </>
  );
}
export default App;
