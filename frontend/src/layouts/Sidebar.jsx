import { NavLink } from "react-router-dom";
import "./sidebar.css";
import { useContext } from "react";
import { Context } from "../context/context";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { user } = useContext(Context);

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
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
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="sidebar-close" onClick={toggleSidebar}>
            &times;
        </button>
        <div className="sidebar-links">
          <NavLink to={"/orders"}>
            Orders <small>{user?.orders.lenght}</small>
          </NavLink>
          <NavLink to={"/favourites"}>Favourites</NavLink>
          <NavLink to={"/cart"}>
            Cart <small>{user?.cart.lenght}</small>
          </NavLink>
          <NavLink to={"/profile"}>Profile</NavLink>
        </div>
      </div>
    </>
  );
}
