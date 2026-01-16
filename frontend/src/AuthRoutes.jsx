import { useContext } from "react";
import { Context } from "./context/context";
import { Outlet, useNavigate } from "react-router-dom";
import { replace } from "react-router-dom";
import Loader from "./layouts/loader";

export default function AuthRoute() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useContext(Context);
  if (!isLoggedIn) {
    navigate("/login", replace);
    return;
  }
  if (loading) return <Loader />;
  return <Outlet />;
}
