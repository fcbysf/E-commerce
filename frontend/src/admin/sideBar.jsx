import { NavLink } from "react-router-dom";
import "./sideBar.css";

export default function SideBAr() {
  const links = [
    'dashbord',
    'orders',
    'products',
    'users',
  ]
  const className = ({isActive})=>{
    return isActive && 'activeLink'||''
  }

  return (
    <aside className="adminSideBar">
      <h2>Admin Panel</h2>
      <div className="sideLinks">
        {
          links.map(link=>(
            <NavLink to={`/admin/${link}`} key={link} className={className}>
              <img src={`/${link}-icon.png`} alt=""  width={25}/>
              <span>{link}</span>
            </NavLink>
          ))
        }
        <hr />
        <NavLink to="/admin/settings" className={className}> 
          <img src="/settings-icon.png" alt=""  width={25}/>
          <span>Settings</span>
          </NavLink>


      </div>
    </aside>
  );
}
