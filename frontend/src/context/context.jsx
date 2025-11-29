import { createContext, useState, useEffect } from "react";

export const Context = createContext();

const Provider = ({ children }) => {
  const api = "http://localhost:8000/api/";
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);
  const [isLoggedIn,setIsLoggedIn] = useState(false)

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, [isLoggedIn]);
  useEffect(()=>{
    fetch(api + "user",{
        headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
    .then((res) =>{
        if(res.ok){
            res.json()
            setIsLoggedIn(true)
        }
        else{
            setIsLoggedIn(false)
            return
        }
    }) 
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
  },[token])

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <Context.Provider value={{ api, token, logout,isLoggedIn,setIsLoggedIn }}>
      {children}
    </Context.Provider>
  );
};
export default Provider;
