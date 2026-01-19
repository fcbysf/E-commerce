import "./adminPanel.css";
import SideBAr from "./sideBar";
import Dashbord from "./dashbord";
import { useParams } from "react-router-dom";
import AdminOrders from "./adminOrders";
import AdminProducts from "./adminProducts";
import EditeProduct from "./editProduct";
import AdminUsers from "./AdminUsers";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/context";
import Loader from "../layouts/loader";

export default function AdminPanel() {
  const { place, id } = useParams();
  const { userRole,loading } = useContext(Context);

  if (userRole != "admin") {
    window.location.href = "/";
    return null;
  }
  if (loading)return(
    <div className="w-full h-screen flex justify-center items-center">

      <Loader />
    </div>
);

  return (
    <div className="adminPanelContainer">
      <SideBAr />
      {place === "dashbord" && <Dashbord />}
      {place === "orders" && <AdminOrders />}
      {place == "products" && <AdminProducts />}
      {place == "editProduct" && id && <EditeProduct />}
      {place == "users" && <AdminUsers />}
    </div>
  );
}
