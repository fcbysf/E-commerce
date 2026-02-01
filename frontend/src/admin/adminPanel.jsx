import "./adminPanel.css";
import SideBAr from "./sideBar";
import Dashbord from "./dashbord";
import { useParams } from "react-router-dom";
import AdminOrders from "./adminOrders";
import AdminProducts from "./adminProducts";
import EditeProduct from "./editProduct";
import AdminUsers from "./AdminUsers";
import { useContext } from "react";
import { Context } from "../context/context";
import Loader from "../layouts/loader";
import NavBar from "../layouts/ShopNavBar";

export default function AdminPanel() {
  const { place, id } = useParams();
  const { userRole, loading } = useContext(Context);

  if (userRole != "admin") {
    window.location.href = "/";
    return null;
  }
  if (loading) return (
    <div className="w-full h-screen flex justify-center items-center">

      <Loader />
    </div>
  );

  return (
    <>
      <NavBar />
      <div className="adminPanelContainer !mt-3">
        <SideBAr />
        <div className="bg-white drop-shadow-md !ps-5 rounded-lg w-[78.5%] m-auto">
          {place === "dashbord" && <Dashbord />}
          {place === "orders" && <AdminOrders />}
          {place == "products" && <AdminProducts />}
          {place == "editProduct" && id && <EditeProduct />}
          {place == "users" && <AdminUsers />}
        </div>
      </div>
    </>
  );
}
