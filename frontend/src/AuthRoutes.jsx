import { useContext } from "react";
import { Context } from "./context/context";
import { Outlet, useNavigate } from "react-router-dom";
import { replace } from "react-router-dom";
import Loader from "./layouts/loader";
import { useEffect } from "react";

export default function AuthRoute() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useContext(Context);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", replace);
      
    }
  }, [isLoggedIn, navigate])

  if (loading) return <Loader />;
  return <Outlet />;
}
