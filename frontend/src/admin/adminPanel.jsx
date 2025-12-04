import "./adminPanel.css";
import SideBAr from "./sideBar";
import Dashbord from "./dashbord";

export default function AdminPanel() {
  return (
    <div className="adminPanelContainer">
      <SideBAr />
      <Dashbord />
    </div>

  );
}
