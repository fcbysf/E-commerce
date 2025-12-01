import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./shop.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/context";
import { Range } from "react-range";
import NavBar from "../layouts/ShopNavBar";

export default function Shop() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showStock, setShowStock] = useState(false);
  const [imageId, setImageId] = useState("");
  const { api, token, userId } = useContext(Context);
  const [checked, setChecked] = useState([]);
  const [productAddedId, setProductAddedId] = useState(null);
  const [values, setValues] = useState([0, 9999]);
  const [added, setAdded] = useState(false);
  const [priceFiltred, setPriceFiltered] = useState("0-9999");
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
    "tech",
  ];
  useEffect(() => {
    if (added) {
      setTimeout(() => {
        setAdded(false);
      }, 3000);
    }
    return clearTimeout();
  }, [added]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPriceFiltered(values.join("-"));
    }, 600);

    return () => clearTimeout(timer);
  }, [values]);

  useEffect(() => {
    const [min, max] = priceFiltred.split("-");

    const url = category
      ? `${api}product?category=${decodeURIComponent(
          category
        )}&min=${min}&max=${max}`
      : `${api}product?min=${min}&max=${max}`;

    fetch(url)
      .then((res) => res.ok && res.json())
      .then((data) => setProducts(data.data))
      .catch((err) => console.log(err));
  }, [category, priceFiltred]);
  const addToCart = (product) => {
    setProductAddedId(product.id);
    fetch(`${api}cart`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: product.id,
        quantity: 1,
      }),
    })
      .then((res) => res.ok && res.json())
      .then((data) => sessionStorage.setItem("cart", data))
      .then(() => setAdded(true))
      .catch((err) => console.log(err));
  };

  return (
    <div className="shopContainer">
      <NavBar />
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
              <Range
                step={10}
                min={0}
                max={9999}
                values={values}
                onChange={(values) => setValues(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "6px",
                      width: "100%",
                      background: "#ddd",
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "20px",
                      width: "20px",
                      backgroundColor: "#1d546c",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      top: "50%", // center vertically
                      transform: "translateY(-50%)", // correct alignment
                    }}
                  />
                )}
              />
              <span className="minMax">
                <small>Min ${values[0]}</small>
                <small>max ${values[1]}</small>
              </span>
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
              // product.price>values[0]&&product.price<values[1]&&
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
                    onClick={() => addToCart(product)}
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
                  {added && product.id === productAddedId &&
                    <div className="success">
                      <div className="success__icon">
                        <svg
                          fill="none"
                          height="24"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            clip-rule="evenodd"
                            d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14c.0878-.1004.1546-.21726.1966-.34383.0419-.12657.0581-.26026.0477-.39319-.0105-.13293-.0475-.26242-.1087-.38085-.0613-.11844-.1456-.22342-.2481-.30879-.1024-.08536-.2209-.14938-.3484-.18828s-.2616-.0519-.3942-.03823c-.1327.01366-.2612.05372-.3782.1178-.1169.06409-.2198.15091-.3027.25537l-4.3 5.159-2.225-2.226c-.1886-.1822-.4412-.283-.7034-.2807s-.51301.1075-.69842.2929-.29058.4362-.29285.6984c-.00228.2622.09851.5148.28067.7034l3 3c.0983.0982.2159.1748.3454.2251.1295.0502.2681.0729.4069.0665.1387-.0063.2747-.0414.3991-.1032.1244-.0617.2347-.1487.3236-.2554z"
                            fill="#393a37"
                            fill-rule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div className="success__title">
                        Product added to cart
                      </div>
                    </div>
                  }
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
