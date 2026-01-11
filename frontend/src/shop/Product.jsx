import NavBar from "../layouts/ShopNavBar";
import "./Product.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/context";
import { useNavigate, useParams } from "react-router-dom";

export default function Product() {
  const { api } = useContext(Context);
  const { id } = useParams();
  const [imageSrc, setImagesSrc] = useState("");
  const [recommenedProducts, setRecommendedProducts] = useState([]);
  const QueryClient = useQueryClient();

  // FETCH PRODUCT
  const { data: product } = useQuery({
    queryKey: ["product", "shop",id],
    queryFn: () =>
      fetch(`${api}product/${id}`)
        .then((res) =>{
          if(res.ok)return res.json();
          else throw Error("product not found")

        })
  });
  useEffect(() => {
    if (product) {
      setImagesSrc(product.image);
    }
  }, [product]);

  useEffect(() => {
    product?.category &&
      fetch(`${api}sameCategoryProducts?category=${product.category}`)
        .then((res) => res.ok && res.json())
        .then((data) => setRecommendedProducts(data.data))
        .catch((err) => console.log(err));
  }, [product?.category]);

  return (product&&
    <div className="productContainer">
      <div className="shopContainer">
        <NavBar />
      </div>
      <main className="productMain">
        <div className="productPage">
          <div className="productImgs">
            <div className="mainImage">
              <img
                src={!imageSrc ? product.image : imageSrc}
                alt="productImage"
              />
            </div>
            <div className="otherImages">
              <div
                className={`aloneImg ${
                  imageSrc === product.image ? "bgImg" : ""
                }`}
              >
                <img
                  src={product.image}
                  alt=""
                  onClick={() => setImagesSrc(product.image)}
                />
              </div>
              {product.images &&
                product.images.map((img) => (
                  <div
                    className={`${img.image_url === imageSrc ? "bgImg" : ""}`}
                  >
                    <img
                      src={img.image_url}
                      alt=""
                      key={img.id}
                      onClick={() => setImagesSrc(img.image_url)}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="oneProductInfos">
            <h1>{product.name}</h1>
            <div className="priceRow">
              <h2>${product.price}</h2>
              <div className="rating">
                <span>(stars)</span>
                <small>(reviews)</small>
              </div>
            </div>
            <div className="description">
              <p>
                <h3>
                  description : <br />
                </h3>
                {product.description}
              </p>
            </div>
            <div className="colors">
              <h3>colors : </h3>
              (colors, soon...)
            </div>
            <div className="size">
              <h3>size : </h3>
              (size, soon...)
            </div>
            <div className="btns">
              <Button product={product} />
              <BuyButton />
            </div>
          </div>
        </div>
        <div className="recommendedP">
          <h2>recommended products</h2>
          <div className="recommendedProducts">
            {recommenedProducts.map(
              (p) =>
                p.id !== product.id && (
                  <div className="product" key={p.id}>
                    <div className="image-wrapper">
                      <img src={p.image} alt="" />
                    </div>
                    <div className="SCproductInfos">
                      <p>{p.name}</p>
                      <i>$ {p.price}</i>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

import styled from "styled-components";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Button = ({ product }) => {
  const navigate = useNavigate();
  const { api, token, isLoggedIn, userId, fetching } = useContext(Context);
  const addToCart = () => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }
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
      .then((data) => {
        sessionStorage.setItem("cart", data);
        fetching();
      })
      .catch((err) => console.log(err));
  };

  return (
    <StyledWrapper>
      <div className="addToCartBtn">
        <input
          hidden
          className="cart-toggle"
          id="cart-toggle"
          type="checkbox"
        />
        <label
          className="cart-button"
          htmlFor="cart-toggle"
          onClick={addToCart}
        >
          <span className="cart-icon">
            <svg
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
              height={24}
              width={24}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle r={1} cy={21} cx={9} />
              <circle r={1} cy={21} cx={20} />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </span>
          Add to Cart
          <div className="progress-bar" />
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .cart-button {
    background: linear-gradient(135deg, #1d546c, #f7f7f7ff);
    color: white;
    margin-top: 100px;
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    font-family: "Poppins", sans-serif;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
  }

  .cart-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  .cart-button:hover::before {
    left: -100%;
  }

  .cart-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(41, 98, 255, 0.4);
  }

  .cart-button:active {
    transform: scale(0.95);
  }

  .cart-icon {
    display: inline-block;
    margin-right: 8px;
    transition: all 0.3s ease;
  }

  .cart-icon svg {
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }

  .cart-button:hover .cart-icon svg {
    transform: scale(1.1);
  }

  @keyframes addedToCart {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.4) rotate(45deg);
    }

    100% {
      transform: scale(1) rotate(0);
    }
  }

  @keyframes progress {
    0% {
      width: 0;
    }

    100% {
      width: 100%;
    }
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.8);
    width: 0;
  }

  .adding {
    pointer-events: none;
    opacity: 0.8;
  }

  .adding .progress-bar {
    animation: progress 1s ease-in-out;
  }

  .success .cart-icon {
    animation: addedToCart 0.5s ease-in-out;
  }

  .cart-button {
    transition: all 0.3s ease, color 0.2s ease;
  }

  .cart-button:hover {
    color: rgba(255, 255, 255, 0.9);
    letter-spacing: 1px;
  }

  @keyframes checkmark {
    0% {
      transform: scale(0);
    }

    50% {
      transform: scale(1.2);
    }

    100% {
      transform: scale(1);
    }
  }

  .success-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .success .success-icon {
    display: block !important;
    animation: checkmark 0.5s ease-in-out forwards;
  }

  .cart-button {
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  .cart-button:active {
    transform: scale(0.95) translateY(2px);
    box-shadow: 0 0 5px rgba(41, 98, 255, 0.2);
  }

  @media (prefers-reduced-motion: reduce) {
    .cart-button {
      transition: none;
    }

    .cart-button:hover,
    .cart-button:active {
      animation: none;
      transform: none;
    }
  }

  .cart-button {
    transform-style: preserve-3d;
    perspective: 1000px;
    background: linear-gradient(135deg, #1d546c, #0c141fff);
    transform: translateZ(0);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cart-button::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0)
    );
    pointer-events: none;
  }

  .cart-button:active {
    transform: translateY(2px) translateZ(-5px);
    box-shadow: 0 0 5px rgba(41, 98, 255, 0.2);
  }

  .cart-button:hover {
    transform: translateZ(10px) scale(1.02);
    box-shadow: 0 4px 15px rgba(41, 98, 255, 0.4),
      0 0 20px rgba(41, 98, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .cart-icon {
    transform: translateZ(5px);
  }

  .progress-bar {
    transform: translateZ(2px);
  }

  .cart-button {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(41, 98, 255, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }

  .cart-button {
    background: linear-gradient(135deg, #2962ff, #1565c0);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    font-family: "Poppins", sans-serif;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
    transform-style: preserve-3d;
    perspective: 1000px;
    background: linear-gradient(135deg, #296985ff, #78b0c9ff);
    transform: translateZ(0);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(41, 98, 255, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    overflow: hidden;

    transition: all 0.3s ease, transform 0.2s ease;
  }

  @media (hover: hover) {
    .cart-button:hover {
      transform: translateZ(10px) rotateX(2deg) rotateY(2deg) scale(1.02);
      box-shadow: 0 4px 15px rgba(41, 98, 255, 0.4),
        0 0 20px rgba(41, 98, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
    }
  }

  .cart-button:hover {
    transform: translateZ(10px);
    background: linear-gradient(135deg, #5a7abbff, #1976d2);
    box-shadow: 0 8px 25px rgba(41, 98, 255, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.15) inset, 0 0 20px rgba(41, 98, 255, 0.2),
      0 0 0 4px rgba(41, 98, 255, 0.1);
    letter-spacing: 1px;
  }

  .cart-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0.05)
    );
    border-radius: 25px 25px 100px 100px;
  }

  .cart-button:active {
    transform: translateY(2px) translateZ(-5px);
    box-shadow: 0 4px 15px rgba(41, 98, 255, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }

  @keyframes subtle-pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(41, 98, 255, 0.4);
    }

    70% {
      box-shadow: 0 0 0 10px rgba(41, 98, 255, 0);
    }

    100% {
      box-shadow: 0 0 0 0 rgba(41, 98, 255, 0);
    }
  }

  .cart-button {
    animation: subtle-pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
  }

  .success {
    background: linear-gradient(135deg, #00c853, #009624) !important;
    transform: translateZ(5px);
    box-shadow: 0 4px 15px rgba(0, 200, 83, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  }

  .success .cart-icon {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
  }

  .cart-button {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  .cart-toggle:checked + .cart-button {
    pointer-events: none;
    animation: addToCart 1.5s ease-in-out forwards;
  }

  @keyframes addToCart {
    0% {
      pointer-events: none;
      opacity: 0.8;
    }
    66% {
      background: linear-gradient(135deg, #2962ff, #1565c0);
    }
    67% {
      background: linear-gradient(135deg, #00c853, #009624);
    }
    100% {
      pointer-events: all;
      opacity: 1;
    }
  }

  .cart-toggle:checked + .cart-button .progress-bar {
    animation: progress 1s ease-in-out;
  }

  .cart-toggle:checked + .cart-button .cart-icon {
    animation: addedToCart 0.5s ease-in-out 1s;
  }

  /* Auto-reset checkbox after animation */
  .cart-toggle:checked {
    animation: reset 0.1s 1.5s forwards;
  }

  @keyframes reset {
    to {
      checked: false;
    }
  }

  /* Hide default checkbox */
  .cart-toggle {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
`;

const BuyButton = () => {
  return (
    <StyledWrappe>
      <button className="button">
        <svg
          viewBox="0 0 16 16"
          className="bi bi-cart-check"
          height={24}
          width={24}
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
        >
          <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
        <p className="text">Buy Now</p>
      </button>
    </StyledWrappe>
  );
};

const StyledWrappe = styled.div`
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 30px;
    gap: 15px;
    background-color: #181717;
    outline: 3px #181717 solid;
    outline-offset: -3px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    border-radius: 25px;
    transition: 400ms;
    margin-top: 30px;
  }

  .button .text {
    color: white;
    font-weight: 700;
    font-size: 0.9em;
    transition: 400ms;
  }

  .button svg path {
    transition: 400ms;
  }

  .button:hover {
    background-color: transparent;
  }

  .button:hover .text {
    color: #181717;
  }

  .button:hover svg path {
    fill: #181717;
  }
`;
