import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./Home"
import AdminPanel from "./admin/adminPanel"
import Provider from "./context/context"
import Shop from "./shop/Shop"
export default function App (){
  return(
    <Provider >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/admin" element={<AdminPanel/>} />
          <Route path="/shop/:category?" element={<Shop/>} />
        </Routes>
      </BrowserRouter>

    </Provider>

  )
}