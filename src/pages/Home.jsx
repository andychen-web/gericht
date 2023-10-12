import React, { useEffect } from 'react'
import Header from '../components/Header'
import AboutUs from '../components/AboutUs'
import Menu from '../components/Menu'
import Chef from '../components/Chef'
import IntroVideo from '../components/IntroVideo'
import Awards from '../components/Awards'
import Gallery from '../components/Gallery'
import Contact from '../components/Contact'

const Home = () => {
  // animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
        } else {
          entry.target.classList.remove('show')
        }
      })
    })
    const hiddenElements = document.querySelectorAll('.hidden')

    hiddenElements.forEach((element) => {
      observer.observe(element)
    })
  }, [])

  return (
    <>
      <Header />
      <AboutUs />
      <Menu />
      <Chef />
      <IntroVideo />
      <Awards />
      <Gallery />
      <Contact />
    </>
  )
}

export default Home
