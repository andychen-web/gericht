import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/custom.css";
import { Route, Routes } from "react-router-dom";
import Products from "./views/Products";
import Product from "./views/Product";
import Cart from "./views/Cart";
import Checkout from "./views/Checkout";
import Home from "./views/Home";
import Orders from "./views/Orders";
import Order from "./components/Order";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "./slices/productSlice";

function App() {
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orderForm.orderArray);
  const products = useSelector((state) => state.product.productArray);

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
        dispatch(setProducts(data.products));
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/products"
        element={<Products token={token} products={products} />}
      />
      <Route path="/cart" element={<Cart token={token} />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      {orders.map((order) => (
        <Route
          key={order.id}
          path={`/order/${order.id}`}
          element={<Order order={order} />}
        />
      ))}
      {products.map((product) => (
        <Route
          key={product.id}
          path={`product/${product.id}`}
          element={
            <Product token={token} product={product} products={products} />
          }
        />
      ))}
    </Routes>
  );
}
export default App;
