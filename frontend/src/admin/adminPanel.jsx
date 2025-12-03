import {NavLink} from 'react-router-dom'
import Dashbord from "./dashbord";
import "./adminPanel.css";

export default function AdminPanel() {
  const navLinks =["dashbord","products","orders","users","settings"]


  return (
    <div className="adminPanelContainer">
        <aside className="adminSideBar">
          <h2>Admin Panel</h2>
          <div className="sideLinks">
            {
              navLinks.map(link=>(
                <NavLink to={`/admin/${link}`}>{link}</NavLink>
              ))
            }
          </div>

        </aside>
    </div>
  );
}
