import { createContext, useState, useEffect, useMemo } from "react";
export const Context = createContext();

const Provider = ({ children }) => {
  const api = "http://localhost:8000/api/";
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("token") ? true : false
  );
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(
    sessionStorage.getItem("role") || null
  );
  const [userShop, setUserShop] = useState({
    orders: 0,
    cart: 0,
    favourites: 0,
  });
  const [loading, setLoading] = useState(true);

  function fetching() {
    fetch(api + "user", {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setIsLoggedIn(true);
          setLoading(false);
          return res.json();
        } else {
          setUserShop({ orders: 0, cart: 0, favourites: 0 });
          setUserId(null);
          setUserRole(null);
          setIsLoggedIn(false);
          setLoading(false);
          setUser(null);
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("role");
        }
      })
      .then((data) => {
        setUser(data.user);
        setUserId(data.user_id);
        setUserRole(data.role);
        setUserShop({ orders: data.orders, cart: data.cart });
        sessionStorage.setItem("role", data.role);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, [isLoggedIn]);
  useEffect(() => {
    fetching();
  }, [token]);
  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("token");
  };


  return useMemo(
    () => (
      <Context.Provider
        value={{
          api,
          token,
          logout,
          isLoggedIn,
          setIsLoggedIn,
          user,
          userId,
          userRole,
          setUserId,
          userShop,
          fetching,
          loading,
        }}
      >
        {children}
      </Context.Provider>
    ),
    [user,userId, token, children, isLoggedIn, userRole, userShop]
  );
};
export default Provider;
