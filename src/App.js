import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/custom.css";
import { Route, Routes } from "react-router-dom";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";

function App() {
  const [products, setProducts] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // 先登入測試帳號取得token，取得後續POST request權限
    fetch("https://vue3-course-api.hexschool.io/v2/admin/signin", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "newandy1@gmail.com",
        password: `${process.env.REACT_APP_PASSWORD}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        authorize(data.token);
        setToken(data.token);
      })
      .catch((error) => console.error(error));

    function authorize(token) {
      fetch("https://vue3-course-api.hexschool.io/v2/api/user/check", {
        method: "POST",
        headers: { Authorization: token },
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch((err) => console.log(err));
    }
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}api/${process.env.REACT_APP_PATH}/products`,
          { method: "GET" }
        );
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);
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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/products"
        element={<Products token={token} products={products} />}
      />
      <Route
        path="/cart"
        element={<Cart token={token} products={products} />}
      />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}
export default App;
