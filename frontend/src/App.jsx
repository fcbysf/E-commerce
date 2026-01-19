import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
const Home = lazy(() => import("./Home"));
const AdminPanel = lazy(() => import("./admin/adminPanel"));
const Shop = lazy(() => import("./shop/Shop"));
const Product = lazy(() => import("./shop/Product"));
const Cart = lazy(() => import("./cart/cart"));
const LogIn = lazy(() => import("./auth/login"));
const SignUp = lazy(() => import("./auth/signup"));
const Order = lazy(() => import("./order/oder"));
const Favourites = lazy(() => import("./favourites/favourites"));
const UserProfile = lazy(() => import("./profile/user-profile"));
const AuthRoute = lazy(() => import("./AuthRoutes"));
const MarkttPlaceLayout = lazy(() => import("./marketplace/marketPlaceLayout"));
const ProductDetailPage = lazy(() =>
  import("./marketplace/ProductDetailPage")
);
const AddListingPage = lazy(() => import("./marketplace/AddListingPage"));
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
          <Route path="marketplace/:place?" element={<MarkttPlaceLayout />} />
          <Route
            path="marketplace/product/:id"
            element={<ProductDetailPage />}
          />

          {/* Auth Routes */}
          <Route element={<AuthRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/marketplace/addListing" element={<AddListingPage />} />
          </Route>
          <Route path="/admin/:place/:id?" element={<AdminPanel />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
