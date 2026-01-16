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
const UserProfile = React.lazy(() => import("./profile/user-profile"));
const AuthRoute = React.lazy(() => import("./AuthRoutes"));
const Marketplace = React.lazy(() => import("./marketplace/MarketplacePage"));
const ProductDetailPage = React.lazy(() =>
  import("./marketplace/ProductDetailPage")
);
import Provider from "./context/context";

export default function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          {/* guest Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route
            path="marketplace/product/:id?"
            element={<ProductDetailPage />}
          />

          {/* Auth Routes */}
          <Route element={<AuthRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
          <Route path="/admin/:place/:id?" element={<AdminPanel />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
