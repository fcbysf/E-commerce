import { Fragment, useContext, useEffect, useState } from "react";
import { Context } from "../context/context";
import NavBar from "../layouts/ShopNavBar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "./order.css";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const { api, userId, token } = useContext(Context);
  useEffect(() => {
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
            {orders.map((order) => (
              <Fragment key={order.id}>
                <tr>
                  <td>#{order.id}</td>
                  <td>{dayjs(order.created_at).toString().slice(4, 16)}</td>
                  <td
                    style={
                      order.status == "pending"
                        ? { color: "orange" }
                        : { color: "green" }
                    }
                  >
                    {order.status}
                  </td>
                  <td>${order.total_price}</td>
                  <td className="pNames">
                    {order.items.map((item) => (
                      <p key={item.id}>{item.product.name} ,</p>
                    ))}
                  </td>
                  <td>{order.items.length}</td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
          {orders.length==0&&<h2 style={{textAlign:"center"}}>no orders yet</h2>
||
            <h2 style={{margin:1}}>
                orders items
            </h2>}
        <div className="ordredP">
          {orders.map((order) =>
            order.items.map((item) => (
              <div className="ordredProduct" key={item.id}>
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
      </div>
    </div>
  );
}
