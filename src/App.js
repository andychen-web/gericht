import { Routes, Route } from "react-router-dom";
import RestaurantHome from "./pages/RestaurantHome";
import React from "react";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RestaurantHome />} />
    </Routes>
  );
}
export default App;
