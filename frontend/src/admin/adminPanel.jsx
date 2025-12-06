import "./adminPanel.css";
import SideBAr from "./sideBar";
import Dashbord from "./dashbord";
import { useParams } from "react-router-dom";
import AdminOrders from "./adminOrders";

export default function AdminPanel() {
  const {place} = useParams()
  return (
    <div className="adminPanelContainer">
      <SideBAr />
      {place === "dashbord" && <Dashbord />}
      {place==='orders'&& <AdminOrders />}
    </div>

  );
}
