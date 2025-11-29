import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./Home"
import AdminPanel from "./admin/adminPanel"
import Provider from "./context/context"
import Shop from "./shop/Shop"
import Product from "./shop/Product"
import Cart from "./cart/cart"
import LogIn from "./auth/login/login"
import SignUp from "./auth/login/signup/signup"
export default function App (){
  return(
    <Provider >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/admin" element={<AdminPanel/>} />
          <Route path="/shop/:category?" element={<Shop/>} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Provider>

  )
}