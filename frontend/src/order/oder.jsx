import { Fragment, useContext, useEffect, useState } from "react";
import { Context } from "../context/context";
import NavBar from "../layouts/ShopNavBar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "./order.css";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const { api, token, isLoggedIn } = useContext(Context);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    fetch(`${api}userOrders`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log(err));
  }, []);
  const orderStyle = (status) => {
    if (status == "pending") {
      return "orange";
    } else if (status == "done") {
      return "lightgreen";
    } else if (status == "canceled") {
      return "red";
    }
  };
  return (
    <div className="orderContainer">
      <NavBar />
      <div className="orders">
        <h1>My orders</h1>
        <table>
          <thead>
            <tr>
              <th>Order number</th>
              <th>Date</th>
              <th>status</th>
              <th>total price</th>
              <th>items</th>
              <th>total items</th>
            </tr>
          </thead>
          <tbody>
            {
              orders?.map((order) => (
              <Fragment key={order.id}>
                <tr>
                  <td>#{order.id}</td>
                  <td>{dayjs(order.created_at).toString().slice(4, 16)}</td>
                  <td
                    className="tdorderStatus"
                    style={{
                      color: orderStyle(order.status),
                      textAlign: "start",
                    }}
                  >
                    {order.status}{" "}
                    {order.status == "pending" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-hourglass-high"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6.5 7h11" />
                        <path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z" />
                        <path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z" />
                      </svg>
                    )}
                    {order.status == "canceled" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ff3d3d"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-x"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6l-12 12" />
                        <path d="M6 6l12 12" />
                      </svg>
                    )}
                    {order.status == "done" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#2acb45"
                        class="icon icon-tabler icons-tabler-filled icon-tabler-circle-check"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                      </svg>
                    )}
                  </td>
                  <td>${order.total_price}</td>
                  <td className="pNames">
                    {(order.items.length > 0 &&
                      order.items.map((item) => (
                        <p key={item.id}>{item.product.name} ,</p>
                      ))) || <p>items not found</p>}
                  </td>
                  <td>{order.items.length}</td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        {(orders.length == 0 && (
          <h2 style={{ textAlign: "center" }}>no orders yet</h2>
        )) || <h2 style={{ margin: 20 }}>orders items</h2>}
        {orders.length > 0 && (
          <div className="ordredP">
            {orders?.map((order) =>
              order.items.map((item) => (
                <div
                  className="ordredProduct"
                  key={item.id}
                  onClick={() => navigate(`/product/${item.product.id}`)}
                >
                  <div className="productImg">
                    <img src={item.product.image} alt="" />
                  </div>
                  <div className="productDetails">
                    <p>{item.product.name}</p>
                    <p>${item.product.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
