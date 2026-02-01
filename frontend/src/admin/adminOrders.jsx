import { useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import { Context } from "../context/context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import "./admineOrders.css";
import { toast } from "react-hot-toast";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Loader from "../layouts/loader";

export default function AdminOrders() {
  const { api, token } = useContext(Context);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { ref, inView } = useInView({ threshold: 0.5, });



  const toggleMenu = (id) => {
    if (menuId == id) {
      setMenuId(null);
      return;
    } else {
      setMenuId(id);
      return;
    }
  };

  // FETCH ORDERS
  async function fetching({ pageParam = 1 }) {
    return await fetch(`${api}order?page=${pageParam}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setMenuId(null);
          return res.json();
        }
      })
  }
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['orders'],
    queryFn: fetching,
    getNextPageParam: (lastPage) => lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined,
    staleTime: 30000
  })
  const orders = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data])
  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage)
      fetchNextPage();
  }, [fetchNextPage, inView, hasNextPage, isFetchingNextPage]);



  // FINISH ORDER
  const { mutate: finishOrderMutation } = useMutation({
    mutationFn: (order) => fetch(`${api}order/${order.id}`, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "done", product: order.items.map(i => i.product) }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        else throw Error("error finishing order");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      toast.success("order done");
    },
    onError: () => {
      toast.error("error finishing order, try again later");
    }

  })
  const orderDone = (order) => {
    if (order.status == "done") return;
    finishOrderMutation(order)
  };

  // CANCEL ORDER
  const { mutate: cancelOrderMutation } = useMutation({
    mutationFn: (order) => fetch(`${api}order/${order.id}`, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "canceled" }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        else throw Error("error canceling order");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      toast.success("order canceled");
    },
    onError: () => {
      toast.error("error canceling order, try again later");
    }
  })

  const cancelOrder = (order) => {
    if (order.status == "canceled") return;
    cancelOrderMutation(order);
  };
  const orderStyle = (status) => {
    if (status == "pending") {
      return "orange";
    } else if (status == "done") {
      return "green";
    } else if (status == "canceled") {
      return "red";
    }
  };
  return (
    <div className="adminOrdersContainer">
      <div className="filterAndTitle">
        <h1 className="text-[#1d546c] !mt-3 !ms-2 !mb-2.5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-package"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /><path d="M16 5.25l-8 4.5" /></svg>orders</h1>
        <div className="filtersCon">
          <div className="filter bg-gray-100">
            <p>status: </p>
            <select
              className="bg-gray-100"
              defaultValue={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">all</option>
              <option value="pending">pending</option>
              <option value="done">done</option>
              <option value="canceled">canceled</option>
            </select>
          </div>
          <div class="input-container bg-gray-100 rounded-2xl">
            <input
              className="bg-gray-100 rounded-2xl"
              type="text"
              placeholder="Search Order"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="adminOrders">
        <table>
          <thead className="bg-gray-400">
            <tr>
              <th>
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
                  class="icon icon-tabler icons-tabler-outline icon-tabler-file-description"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                  <path d="M9 17h6" />
                  <path d="M9 13h6" />
                </svg>
                <p>Order Number</p>
              </th>
              <th>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="icon icon-tabler icons-tabler-filled icon-tabler-user"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                  <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
                </svg>
                <p>Customer</p>
              </th>
              <th>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="icon icon-tabler icons-tabler-filled icon-tabler-hourglass"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M17 2a2 2 0 0 1 1.995 1.85l.005 .15v2a6.996 6.996 0 0 1 -3.393 6a6.994 6.994 0 0 1 3.388 5.728l.005 .272v2a2 2 0 0 1 -1.85 1.995l-.15 .005h-10a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-2a6.996 6.996 0 0 1 3.393 -6a6.994 6.994 0 0 1 -3.388 -5.728l-.005 -.272v-2a2 2 0 0 1 1.85 -1.995l.15 -.005h10z" />
                </svg>
                <p>Status</p>
              </th>
              <th>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="icon icon-tabler icons-tabler-filled icon-tabler-coin"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 2.66a1 1 0 0 0 -1 1a3 3 0 1 0 0 6v2a1.024 1.024 0 0 1 -.866 -.398l-.068 -.101a1 1 0 0 0 -1.732 .998a3 3 0 0 0 2.505 1.5h.161a1 1 0 0 0 .883 .994l.117 .007a1 1 0 0 0 1 -1l.176 -.005a3 3 0 0 0 -.176 -5.995v-2c.358 -.012 .671 .14 .866 .398l.068 .101a1 1 0 0 0 1.732 -.998a3 3 0 0 0 -2.505 -1.501h-.161a1 1 0 0 0 -1 -1zm1 7a1 1 0 0 1 0 2v-2zm-2 -4v2a1 1 0 0 1 0 -2z" />
                </svg>
                <p>Total</p>
              </th>
              <th>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="icon icon-tabler icons-tabler-filled icon-tabler-calendar-event"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M16 2a1 1 0 0 1 .993 .883l.007 .117v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 1 0 0 1 1.993 -.117l.007 .117v1h6v-1a1 1 0 0 1 1 -1m3 7h-14v9.625c0 .705 .386 1.286 .883 1.366l.117 .009h12c.513 0 .936 -.53 .993 -1.215l.007 -.16z" />
                  <path d="M8 14h2v2h-2z" />
                </svg>
                <p>Date</p>
              </th>
              <th>
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
                  class="icon icon-tabler icons-tabler-outline icon-tabler-activity"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 12h4l3 8l4 -16l3 8h4" />
                </svg>
                <p>Actions</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(
              (order) =>
                ((status == "all" && order.id.toString().includes(search)) ||
                  (status == order.status &&
                    order.id.toString().includes(search))) && (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order.id)}
                    className={selectedOrder === order.id ? "bg-gray-200" : "bg-gray-100"}
                  >
                    <td>#{order.id}</td>
                    <td>{order.user.name}</td>
                    <td
                      className="tdorderStatus"
                      style={{ color: orderStyle(order.status) }}
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
                    <td>{dayjs(order.created_at).toString().slice(5, 17)}</td>
                    <td className="menuWrapper">
                      {order.status !== "done" && (
                        <label
                          className="hamburger"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(order.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            onClick={(e) => e.stopPropagation()}
                            checked={menuId == order.id}
                          />
                          <svg viewBox="0 0 32 32">
                            <path
                              className="line line-top-bottom"
                              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                            ></path>
                            <path className="line" d="M7 16 27 16"></path>
                          </svg>
                        </label>
                      )}
                      <div
                        className="menu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {menuId == order.id && order.status == "pending" && (
                          <>
                            <span onClick={() => cancelOrder(order)}>
                              cancel order❌
                            </span>
                            <span onClick={() => orderDone(order)}>
                              order done✅
                            </span>
                          </>
                        )}
                        {order.id == menuId && <span>block user🚫</span>}
                      </div>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
        {orders?.map(
          (order) =>
            order.id == selectedOrder && (
              <div className="orderDialog">
                <div className="orderNumAndCancel">
                  <h2>order #{order.id}</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-x"
                    onClick={() => setSelectedOrder(null)}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                  </svg>
                </div>
                <div className="stsAndDate">
                  <p
                    style={{ backgroundColor: `${orderStyle(order.status)}` }}
                    className="pending"
                  >
                    {order.status}
                  </p>
                  <small>
                    {dayjs(order.createdAt).toString().slice(5, 17)}
                  </small>
                </div>
                <div className="orderUserInfs">
                  <p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="icon icon-tabler icons-tabler-filled icon-tabler-user"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                      <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
                    </svg>{" "}
                    {order.user.name}
                  </p>
                  <p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="icon icon-tabler icons-tabler-filled icon-tabler-phone"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 3a1 1 0 0 1 .877 .519l.051 .11l2 5a1 1 0 0 1 -.313 1.16l-.1 .068l-1.674 1.004l.063 .103a10 10 0 0 0 3.132 3.132l.102 .062l1.005 -1.672a1 1 0 0 1 1.113 -.453l.115 .039l5 2a1 1 0 0 1 .622 .807l.007 .121v4c0 1.657 -1.343 3 -3.06 2.998c-8.579 -.521 -15.418 -7.36 -15.94 -15.998a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" />
                    </svg>
                    {order.phone}
                  </p>
                  <p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="icon icon-tabler icons-tabler-filled icon-tabler-map-pin"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
                    </svg>{" "}
                    {order.address}
                  </p>
                </div>
                <div className="orderUserItems">
                  {order.items.map((item) => (
                    <div className="orderUserItem">
                      <div className="imgWrapper">
                        <img src={item.product.image} alt="" />
                      </div>
                      <div className="nameAndPrice">
                        <p>{item.product.name}</p>
                        <small>${item.product.price}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="orderUserTotal">
                  <small>total</small>
                  <p>${order.total_price}</p>
                </div>
                {order.status == "pending" && (
                  <div className="orderBtns">
                    <button onClick={() => orderDone(order)}>
                      order done{" "}
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
                        class="icon icon-tabler icons-tabler-outline icon-tabler-check"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 12l5 5l10 -10" />
                      </svg>
                    </button>
                    <button onClick={() => cancelOrder(order)}>
                      cancel order{" "}
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
                        class="icon icon-tabler icons-tabler-outline icon-tabler-x"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6l-12 12" />
                        <path d="M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )
        )}
      </div>
      <div className="!mt-3" ref={ref} >{isFetchingNextPage && <Loader />}</div>
    </div>
  );
}
