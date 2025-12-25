import "./adminPanel.css";
import SideBAr from "./sideBar";
import Dashbord from "./dashbord";
import { useParams } from "react-router-dom";
import AdminOrders from "./adminOrders";
import AdminProducts from "./adminProducts";
import EditeProduct from "./editProduct";
import AdminUsers from "./AdminUsers";
import { useContext, useEffect } from "react";
import { Context } from "../context/context";

export default function AdminPanel() {
  const {place, id} = useParams();
  const {userRole, userId} = useContext(Context)

  useEffect(()=>{
      if(userRole!='admin'){
        window.location.href='/'
      }
  },[userRole])
  return (
    userRole=='admin' &&
    <div className="adminPanelContainer">
      <SideBAr />
      {place === "dashbord" && <Dashbord />}
      {place==='orders'&& <AdminOrders />}
      {place=='products' && <AdminProducts />}
      {(place=='editProduct'&&id) && <EditeProduct />}
      {place=='users' && <AdminUsers />}
    </div>
  );
}
