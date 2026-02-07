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
    queryKey: ["product", "shop", id],
    queryFn: () =>
      fetch(`${api}product/${id}`)
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("product not found")

        })
  });
  useEffect(() => {
    if (product) {
      setImagesSrc(product.image);
    }
  }, [product]);

  // FETCH SAME CATEGORY PRODUCTS
  useEffect(() => {
    product?.category &&
      fetch(`${api}sameCategoryProducts?category=${product.category}`)
        .then((res) => res.ok && res.json())
        .then((data) => setRecommendedProducts(data.data))
        .catch((err) => console.log(err));
  }, [product?.category]);

  return (product &&
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
                className={`aloneImg ${imageSrc === product.image ? "bgImg" : ""
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
          <div className="oneProductInfos !bg-white mt-10 rounded-xl shadow-xl">
            <h1 className="text-[#1d546c] !m-0">{product.name}</h1>
            <div className="priceRow">
              <h2>${product.price}</h2>
              <div className="rating">
                <span><FourStars /></span>
              </div>
            </div>
            <div className="description">
              <p className="!m-0 ">
                <h3 className="!mb-2.5">
                  description : <br />
                </h3>
                <span className="text-black/40 !ms-2">
                  {product.description}

                </span>
              </p>
            </div>
            <div className="colors ">
              <h3 className="!mb-2.5">colors : </h3>
              <span className="text-black/40 !ms-2">
                (colors, soon...)

              </span>
            </div>
            <div className="size">
              <h3 className="!mb-2.5">size : </h3>
              <span className="text-black/40 !ms-2">
                (size, soon...)
              </span>
            </div>
            <div className="btns">
              <Button product={product} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import styled from "styled-components";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Stars } from "lucide-react";

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
export function FourStars() {
  return (
    <div className="flex gap-1">
      <Star size={14} className="text-yellow-400 fill-yellow-400" />
      <Star size={14} className="text-yellow-400 fill-yellow-400" />
      <Star size={14} className="text-yellow-400 fill-yellow-400" />
      <Star size={14} className="text-yellow-400 fill-yellow-400" />
      <Star size={14} className="text-gray-300" />
    </div>
  );
}