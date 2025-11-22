import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./shop.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/context";

export default function Shop() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [priceFiltre, setPriceFilter] = useState(0);
  const [products, setProducts] = useState([]);
  const [showStock, setShowStock] = useState(false);
  const [imageId, setImageId] = useState("");

  const { api } = useContext(Context);
  const [checked, setChecked] = useState([]);
  const [brands, setBrands] = useState([
    { brand: "nike", icon: "/nike-removebg-preview.png" },
    { brand: "adidas", icon: "/download-removebg-preview.png" },
    { brand: "asics", icon: "/download-removebg-preview (1).png" },
    { brand: "xiomi", icon: "/download-removebg-preview (2).png" },
    { brand: "new balance", icon: "/download-removebg-preview (4).png" },
    { brand: "Apple", icon: "/download-removebg-preview (3).png" },
  ]);
  const categories = [
    "all categories",
    "fashion",
    "health",
    "art",
    "home",
    "sport",
    "music",
    "gaming",
    "tech"
  ];
  useEffect(() => {
    if (!category) {
      fetch(api + "product")
        .then((res) => res.ok && res.json())
        .then((data) => setProducts(data.data))
        .catch((err) => console.log(err));
    }
  }, []);
  useEffect(() => {
    if (category) {
      fetch(api + `product?category=${decodeURIComponent(category)}`)
        .then((res) => res.ok && res.json())
        .then((data) => setProducts(data.data))
        .catch((err) => console.log(err));
    }
  }, [category]);
  return (
    <div className="shopContainer">
      <header>
        <div className="logoAndsearch">
          <h1>YSF SHOOP</h1>
          <form className="form">
            <button>
              <svg
                width="17"
                height="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="search"
              >
                <path
                  d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
            <input
              className="input"
              placeholder="Type your text"
              required=""
              type="text"
            />
            <button className="reset" type="reset">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </form>
        </div>
        <div className="Links">
          <NavLink to={"/orders"}>Orders</NavLink>
          <NavLink to={"/favourites"}>Favoutites</NavLink>
          <NavLink to={"/cart"}>Cart</NavLink>
          <NavLink to={"/profile"}>
            <img src="me.jpg" alt="" />
          </NavLink>
        </div>
      </header>
      <main>
        <div className="categories">
          {categories.map((c) => (
            <NavLink
              key={c}
              to={`/shop/${c == "all categories" ? "allCategories" : c}`}
              style={({ isActive }) =>
                (isActive && {
                  backgroundColor: "#346e86d8",
                  color: "white",
                }) ||
                {}
              }
            >
              {c}
            </NavLink>
          ))}
        </div>
        <section>
          <aside>
            <div className="filterByPrice">
              <div className="topOfpriceDiv">
                <h3>price range</h3>
                <small>reset</small>
              </div>
              <input
                type="range"
                max={9999}
                min={0}
                value={priceFiltre}
                onChange={(e) => setPriceFilter(e.target.value)}
              />{" "}
              <br />
              starting price ${priceFiltre}
            </div>
            <div className="filterByBrand">
              <div className="topOfpriceDiv">
                <h3>brand</h3>
                <small>reset</small>
              </div>
              {brands.map((b) => (
                <div className="brand" key={b.brand}>
                  <div className="leftBrand">
                    <img src={b.icon} width={20} alt="brand icon" />
                    <p>{b.brand}</p>
                  </div>
                  <input
                    type="checkbox"
                    name={b.brand}
                    onChange={(e) => setChecked([...checked, e.target.name])}
                  />
                </div>
              ))}
            </div>
          </aside>
          <div className="productsSide">
            {products.map((product) => (
              <div
                key={product.id}
                className="oneProduct"
                onMouseOver={() => {
                  setShowStock(true);
                  setImageId(product.id);
                }}
                onMouseOut={() => setShowStock(false)}
              >
                <div
                  className="image-wrapper"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img src={product.image} alt="" />
                  {showStock && product.id === imageId && (
                    <p>{product.stock} left</p>
                  )}
                </div>
                <div className="productInfos">
                  <p>{product.name}</p>
                  <i>$ {product.price}</i>
                  <button
                    className="cartBtn"
                    onClick={() => navigate(`/product`)}
                  >
                    <svg
                      className="cart"
                      fill="white"
                      viewBox="0 0 576 512"
                      height="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                    </svg>
                    ADD TO CART
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 640 512"
                      className="svg"
                    >
                      <path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
