import { NavLink, useNavigate } from "react-router-dom";
import "./sideBar.css";
import { ArrowLeft, BookOpen, Boxes, BoxIcon, BoxSelect, LayoutDashboard, List, Settings, Settings2, ShoppingCart, User, Users } from "lucide-react";



export default function SideBAr() {
  const navigate = useNavigate();
  const links = [
    { link: 'dashbord', icon: <LayoutDashboard /> },
    { link: 'orders', icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-text"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" /><path d="M9 12h6" /><path d="M9 16h6" /></svg> },
    { link: 'products', icon: <ShoppingCart /> },
    { link: 'users', icon: <Users /> },
  ]

  const className = ({ isActive }) => {
    return isActive && 'activeLink' || ''
  }

  return (
    <aside className="adminSideBar">
      <div className=" flex items-center gap-2 !m-2 !mb-0 cursor-pointer" onClick={() => navigate('/shop/allCategories')}>
        <ArrowLeft size={17} />
        <small className="text-xs"> Back To shop</small>
      </div>
      <h1 className="text-[28px]">Admin Panel</h1>
      <div className="sideLinks">
        {
          links.map(link => (
            <NavLink to={`/admin/${link.link}`} key={link.link} className={className}>
              {link.icon}
              <span>{link.link}</span>
            </NavLink>
          ))
        }
        <hr />
        <NavLink to="/admin/settings" className={className}>
          <Settings />
          <span>Settings</span>
        </NavLink>


      </div>
    </aside>
  );
}
