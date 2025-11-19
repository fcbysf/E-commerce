import { NavLink } from "react-router-dom";
import "./home.css";
import { useEffect, useState } from "react";

export default function Home() {
    const [animateText, setAnimate] = useState(false)
    const [animateImg, setAnimateImg] = useState(false)
    useEffect(()=>{
        setTimeout(()=>{
            setAnimate(true)
        },1000)
        setTimeout(()=>{
            setAnimateImg(true)
        },1000)
    },[])
  return (
    <div className="homeContainer">
      <header>
        <nav>
          <div className="leftLinks">
            <NavLink to={"/shop"}>Shop</NavLink>
            <NavLink to={"/shop/men"}>Men</NavLink>
            <NavLink to={"/shop/women"}>women</NavLink>
            <NavLink to={"/shop/trending"}>Trending</NavLink>
          </div>
          <div className="logo">
            <h1>YSF SHOOP</h1>
          </div>
          <div className="rightLinks">
            <NavLink to={"/shop/accesories"}>Accessories</NavLink>
            <NavLink to={"/login"}>login</NavLink>
            <NavLink to={"/signup"}>signUp</NavLink>
          </div>
        </nav>
      </header>
      <main>
        <div className={`marketingText ${!animateText?"display":""}`} style={{display:`${animateText?"block":"none"}}`,right:!animateText?1000:0}}>
          <h1>
            Discover the best deals on the products you love. Shop <b>smart</b>,
            shop <b>fast</b>
          </h1>
          <button>
            <span>shop now</span>
          </button>
        </div>
        <article className={`${!animateImg?"animateImg":""}`}>
            <img
            src="puffer.gif"
            style={{ overflow: "hidden",}}
            />
        </article>
      </main>
    </div>
  );
}
