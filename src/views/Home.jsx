import React from "react";
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

const Home = () => {
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
};

export default Home;
