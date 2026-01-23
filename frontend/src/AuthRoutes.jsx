import { useContext } from "react";
import { Context } from "./context/context";
import { Outlet, useNavigate } from "react-router-dom";
import Loader from "./layouts/loader";
import { useEffect } from "react";

export default function AuthRoute() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useContext(Context);
  useEffect(() => {
    if(window.location.pathname=="/marketplace" || window.location.pathname.includes("/marketplace/product"))return 
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate])

  if (loading) return(
    <div className="w-full h-screen flex justify-center items-center">
      <Loader />
    </div>
  )
  return <Outlet />;
}
