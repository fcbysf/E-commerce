import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
const Home = React.lazy(() => import("./Home"));
const AdminPanel = React.lazy(() => import("./admin/adminPanel"));
const Shop = React.lazy(() => import("./shop/Shop"));
const Product = React.lazy(() => import("./shop/Product"));
const Cart = React.lazy(() => import("./cart/cart"));
const LogIn = React.lazy(() => import("./auth/login"));
const SignUp = React.lazy(() => import("./auth/signup"));
const Order = React.lazy(() => import("./order/oder"));
const Favourites = React.lazy(() => import("./favourites/favourites"));
import Provider from "./context/context";

export default function App() {
  return (
    <Provider>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/:place/:id?" element={<AdminPanel />} />
            <Route path="/shop/:category?" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="*" element={<Home />} />
          </Routes>
      </BrowserRouter>
    </Provider>
  );
}
