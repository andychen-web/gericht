import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import Header from "../components/Header";
import AboutUs from "../components/AboutUs";
import Menu from "../components/Menu";
import Chef from "../components/Chef";
import IntroVideo from "../components/IntroVideo";
import Awards from "../components/Awards";
import Gallery from "../components/Gallery";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(false);
  }, []);
  return (
    <>
      <Loader isLoading={isLoading} />
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
};

export default Home;
