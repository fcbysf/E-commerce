import { useContext, useEffect, useState } from "react";
import NavBar from "../layouts/ShopNavBar";
import { Context } from "../context/context";
import { replace, useNavigate } from "react-router-dom";
export default function Cart() {
  const navigate= useNavigate()
  const [cart, setCart] = useState({});
  const [total, setTotal] = useState(0);
  const { api, token,isLoggedIn } = useContext(Context);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login",replace);
      return
    }
    if (token) {
      fetch(`${api}cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setCart(data))
        .catch((err) => console.log(err));
    }
  }, [token,isLoggedIn]);
  return (
    <div className="cartContainer">
      <NavBar />
    </div>
  );
}
