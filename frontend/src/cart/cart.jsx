import { useContext, useEffect, useState } from "react";
import NavBar from "../layouts/ShopNavBar";
import { Context } from "../context/context";
import { replace, useNavigate } from "react-router-dom";
import "./cart.css";
export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const { api, token, isLoggedIn } = useContext(Context);
  useEffect(() =>{
    let total = 0;
    if(cart){
      cart.forEach(c => {
        total+=(c.product.price * c.quantity)
      });
      setTotal(total+3.5)
    }
  },[cart])
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", replace);
      return;
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
  }, [token, isLoggedIn]);
  return (
    <div className="cartContainer">
      <NavBar />
      <main className="cartMain">
        <div className="cartProducts">
          {cart?.map((c) => (
            <div className="cartP">
              <div className="cartPImg">
                <img src={c.product.image} alt="" width={100} />
              </div>
              <div className="cartDetails">
                <div className="titleAndCancel">
                  <h2 style={{ marginBottom: 0 }}>{c.product.name}</h2>
                  <small>X</small>
                </div>
                <p style={{ opacity: 0.6, textIndent: 10 }}>
                  ${c.product.price}
                </p>
                <small>quantity : {c.quantity}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="cartCheckout">
          {cart.map((c) => (
            <div className="productAndPrice">
              <p>{c.product.name}</p>
              <p>${c.product.price}</p>
            </div>
          ))}
          <hr />
          <div className="dilevry">
            <p>dilevry : </p>
            <p>$3.5</p>
          </div>
          <hr />
          <div className="total">
            <p>total : </p>
            <p>${total}</p>
          </div>
          <label className="order-wrapper">
            <input type="checkbox" id="order-toggle" hidden />
            <span className="order">
              <span className="default">Click To Finish Checkout</span>
              <span className="success">
                Order Finished
                <svg viewBox="0 0 12 10">
                  <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </svg>
              </span>
              <div className="box"></div>
              <div className="truck">
                <div className="back"></div>
                <div className="front">
                  <div className="window"></div>
                </div>
                <div className="light top"></div>
                <div className="light bottom"></div>
              </div>
              <div className="lines"></div>
            </span>
          </label>
        </div>
      </main>
    </div>
  );
}
