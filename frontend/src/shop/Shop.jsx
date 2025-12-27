import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./shop.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/context";
import { Range } from "react-range";
import NavBar from "../layouts/ShopNavBar";
import toast from "react-hot-toast";

export default function Shop() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showStock, setShowStock] = useState(false);
  const [imageId, setImageId] = useState("");
  const { api, token, userId, fetching } = useContext(Context);
  const [checked, setChecked] = useState([]);
  const [values, setValues] = useState([0, 9999]);
  const [priceFiltred, setPriceFiltered] = useState("0-9999");
  const [favourites, setFavourites] = useState([]);
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
  function fetchFav(){
    fetch(api + "favourites", {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.ok && res.json())
      .then((data) => setFavourites(data))
      .catch((err) => console.log(err));
  }
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
      .then((res) => {
        if (res.ok) {
          toast.success("product added to cart");
          fetching();
          return res.json();
        }
      })
      .then((data) => sessionStorage.setItem("cart", data))
      .catch((err) => console.log(err));
  };
  const resetPriceFilter = () => {
    setValues([0, 9999]);
    setPriceFiltered("0-9999");
  };
  const addToFav = (id) => {
    fetch(`${api}favourites`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: id, user_id: userId}),
    })
    .then((res) => {
      if (res.ok) {
        fetchFav();
      }
    })
    .catch((err) => console.log(err));
  };
  const removeFromFav = (id) => {
    fetch(`${api}favourites/${id}`,{
      method: "DELETE",
      headers:{
        accept: "application/json",
        "Content-Type": "application/json",
      }
  })
  .then((res) => {
    if (res.ok) {
      fetchFav();
    }
  })
  .catch((err) => console.log(err));
  }
  useEffect(() => {
    fetchFav();
  }, [favourites.length]);
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
                <small onClick={resetPriceFilter} style={{ cursor: "pointer" }}>
                  reset
                </small>
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
            {products.length === 0 && (
              <div className="noProducts">
                {products.length === 0 && priceFiltred == "0-9999" && (
                  <h2>
                    no products in{" "}
                    <i style={{ color: "#437f99" }}>{category}</i> category yet
                    !{" "}
                  </h2>
                )}
                {products.length === 0 && priceFiltred !== "0-9999" && (
                  <h2>no products found</h2>
                )}
              </div>
            )}
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
                <div className="heartIcon">
                {(!favourites.map(f=>f.product_id).includes(product.id) && (
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      onClick={() => addToFav(product.id)}
                      className="icon icon-tabler icons-tabler-outline icon-tabler-heart"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                )) || 
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                onClick = {()=>removeFromFav(favourites.find(f=>f.product_id === product.id).id)}
                class="icon icon-tabler icons-tabler-filled icon-tabler-heart"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
                  </svg>
                }
                </div>
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
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
