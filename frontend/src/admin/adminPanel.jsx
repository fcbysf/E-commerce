import "./adminPanel.css";
import SideBAr from "./sideBar";
import Dashbord from "./dashbord";
import { useParams } from "react-router-dom";

export default function AdminPanel() {
  const {place} = useParams()
  return (
    <div className="adminPanelContainer">
      <SideBAr />
      <Dashbord />
    </div>

  );
}
