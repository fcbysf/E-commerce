import { NavLink } from "react-router-dom";
import "./home.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [animateText, setAnimate] = useState(false);
  const [animateImg, setAnimateImg] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 1000);
    setTimeout(() => {
      setAnimateImg(true);
    }, 1000);
  }, []);
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
        <div
          className={`marketingText ${!animateText ? "display" : ""}`}
          style={{
            display: `${animateText ? "block" : "none"}}`,
            right: !animateText ? 1000 : 0,
          }}
        >
          <h1>
            Discover the best deals on the products you love. Shop <b>smart</b>,
            shop <b>fast</b>
          </h1>
          <button>
            <span>shop now</span>
          </button>
        </div>
        <article className={`${!animateImg ? "animateImg" : ""}`}>
          <small>
            Find everything you need in one place. Simple, fast, reliable
          </small>
          <img
            className="puffer"
            src="puffer.gif"
            style={{ overflow: "hidden" }}
          />
          <img
            src="products_image-removebg-preview (2).png"
            className="productsImage"
          />
        </article>
      </main>
      <section>
        <h1 className="textFlowt">COMFORT</h1>
        <div className="forLeft">
          <img
            src="vue-rapprochee-d-une-personne-portant-des-baskets-futuristes.jpg"
            alt=""
          />
          <small>
            Shop smarter with premium products, affordable deals, and quick
            delivery.
          </small>
        </div>
        <div className="forMiddle">
          <img
            src="gros-plan-sur-un-homme-devant-des-piles-de-vetements.jpg"
            alt=""
          />
        </div>
        <div className="forRight">
          <div className="rightP">
            <small>Simple, stylish, and affordable. Your favorite products, just a click away.</small>
          </div>
          <img src="f7af44fe62017af88857e939d7550b9f.jpg" alt="" />
        </div>
      </section>
    </div>
  );
}
