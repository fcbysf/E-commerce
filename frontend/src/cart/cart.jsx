import { useContext, useEffect, useState } from "react";
import NavBar from "../layouts/ShopNavBar";
import { Context } from "../context/context";
import { NavLink} from "react-router-dom";
import "./cart.css";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Cart() {
  const [total, setTotal] = useState(0);
  const [address, setaddress] = useState("");
  const [phone, setPhone] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);
  const { api, token,fetching } = useContext(Context);
  const queryClient = useQueryClient();

  // FETCH USER CART
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () =>
      fetch(`${api}cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (res.ok) return res.json();
        else throw Error("something went wrong");
      }),
  });

  // CALCULATING TOTAL PRICE
  useEffect(() => {
    let total = 0;
    if (cart) {
      cart.forEach((c) => {
        total += c.product.price * c.quantity;
      });
      setTotal(total + 3.5);
    }
  }, [cart]);

  // FINISH ORDER
  const { mutate: finishOrderMutation } = useMutation({
    mutationFn: () =>
      fetch(`${api}order`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cart: cart,
          address,
          phone,
          total_price: total,
        }),
      }).then((res) => {
        if (!res.ok) throw Error("something went wrong");
      }),
    onSuccess: () => {
      setOrderCompleted(true);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      fetching();
      toast.success("order finished");
    },
  });
  const finishOrder = () => {
    setTimeout(() => {
      finishOrderMutation();
    }, 6500);
  };

  // REMOVE FROM CART
  const { mutate: removeFromCartMutation } = useMutation({
    mutationFn: (c) =>
      fetch(`${api}cart/${c.id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (!res.ok) throw Error("something went wrong");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      fetching()
      toast.success("product removed from cart");
    },
    onError: () => {
      toast.error("something went wrong");
    },
  });
  const removeFromCart = (c) => {
    removeFromCartMutation(c);
  };
  return (
    (
      <div className="cartContainer">
        <NavBar />
        <main className="cartMain">
          {cart?.length === 0 && !orderCompleted && (
            <div className="emptyCart">
              <h1>
                cart is empty, <NavLink to={"/shop"}>shop now</NavLink>
              </h1>
            </div>
          )}
          {orderCompleted && (
            <h3>
              order finished, see order status in{" "}
              <NavLink to={"/orders"}>Orders</NavLink>
            </h3>
          )}
          <div className="cartProducts">
            {cart?.map((c) => (
              <div className="cartP" key={c.id}>
                <div className="cartPImg">
                  <img src={c.product.image} alt="" width={100} />
                </div>
                <div className="cartDetails">
                  <div className="titleAndCancel">
                    <h2 style={{ marginBottom: 0 }}>{c.product.name}</h2>
                    <small onClick={() => removeFromCart(c)}>X</small>
                  </div>
                  <p style={{ opacity: 0.6, textIndent: 10 }}>
                    ${c.product.price}
                  </p>
                  <small>quantity : {c.quantity}</small>
                </div>
              </div>
            ))}
          </div>
          {cart?.length > 0&& (
            <div className="cartCheckout ">
              {cart?.map((c) => (
                <div className="productAndPrice" key={c.id}>
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
              <hr />
              <div className="inputs">
                <label htmlFor="address">address : </label>
                <textarea
                  name="address"
                  id="address"
                  placeholder="address"
                  onChange={(e) => setaddress(e.target.value)}
                ></textarea>
                <label htmlFor="phone">Phone : </label>
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  placeholder="Phone"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <label className="order-wrapper">
                <input
                  type={
                    address.length >= 8 && phone.length >= 8 ? "checkbox" : ""
                  }
                  id="order-toggle"
                  hidden
                  onClick={finishOrder}
                />
                <span
                  className={
                    address.length >= 8 && phone.length >= 8
                      ? "order"
                      : "orderDisabled"
                  }
                >
                  <span className="default">
                    {address.length >= 8 && phone.length >= 8
                      ? "Finish Checkout"
                      : "fill all inputs"}
                  </span>
                  {address.length >= 8 && phone.length >= 8 && (
                    <>
                      <span className="success">
                        {address.length >= 8 &&
                          phone.length >= 8 &&
                          "Order Finished"}
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
                    </>
                  )}
                </span>
              </label>
            </div>
          )}
        </main>
      </div>
    )
  );
}
