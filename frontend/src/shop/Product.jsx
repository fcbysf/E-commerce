import NavBar from "../layouts/ShopNavBar";
import "./Product.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/context";
import { useParams } from "react-router-dom";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [imageSrc, setImagesSrc] = useState("");
  const { api } = useContext(Context);
  useEffect(() => {
    fetch(`${api}product/${id}`)
      .then((res) => res.ok && res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err));
  }, [id]);
  return (
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
                <div className={`aloneImg ${imageSrc === product.image ? "bgImg" : ""}`}>
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
        </div>
      </main>
    </div>
  );
}
