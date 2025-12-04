import { useContext, useState } from "react";
import { Context } from "../context/context";
import "./dashbord.css";

function Dashbord() {
  const [images, setImages] = useState([]);
  const { api, token } = useContext(Context);
  const [selectedSize, setSelectedSize] = useState([])
  const sizes = ["xs", "s", "m", "l", "xl", "xxl"]

  const submit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.delete("images");
    images.forEach((image) => {
      formData.append("images[]", image);
    });
    fetch(api + "product", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  };
  const addSize = (size) => {
    if(selectedSize.includes(size)){
      setSelectedSize(selectedSize.filter(s=>s!==size))
      return
    } 
    setSelectedSize([...selectedSize,size])
  }
  return (
    <div className="dachbordContainer">
      <form onSubmit={submit} encType="multipart/form-data">
        <div className="formLeftSide">
          <h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-building-store"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 21l18 0" />
              <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
              <path d="M5 21l0 -10.15" />
              <path d="M19 21l0 -10.15" />
              <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
            </svg>{" "}
            Add Product
          </h1>
          <div className="generalInfos">
            <h2>general Infos</h2>
            <div className="name">
              <label htmlFor="">Product name: </label>
              <br />
              <input type="text" name="name" placeholder="name" />
            </div>
            <div className="description">
              <label htmlFor="">Product description: </label>
              <br />
              <textarea
                name="description"
                placeholder="description"
                rows={4}
              ></textarea>
            </div>
            <div className="sizes">
              <label htmlFor="">Product sizes: </label>
              <br />
              <div className="sizesBtns">
                {
                  sizes.map(size=>(
                    <span className={`sizeBtn ${selectedSize.includes(size)?"selectedSize":""}`} key={size} onClick={()=>addSize(size)}
                     >
                      {size}
                      </span>
                  ))
                }
              </div>
              
            </div>
          </div>
          <br />
          <input type="text" name="price" placeholder="price" />
          <br />
          <input type="text" name="stock" placeholder="stock" />
          <br />
          <input type="text" name="category" placeholder="category" />
          <br />
          main product image :
          <input type="file" name="image" />
          <br />
          product images :
          <input
            type="file"
            name="images"
            onChange={(e) => setImages([...e.target.files])}
            multiple
          />
          <br />
          <button type="submit" onSubmit={submit}>
            add product
          </button>
        </div>
      </form>
    </div>
  );
}
export default Dashbord;
