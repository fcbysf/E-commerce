import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./Home"
import AdminPanel from "./admin/adminPanel"
import Provider from "./context/context"
export default function App (){
  return(
    <Provider >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/admin" element={<AdminPanel/>} />
        </Routes>
      </BrowserRouter>

    </Provider>

  )
}