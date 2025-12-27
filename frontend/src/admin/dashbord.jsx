import { useContext, useEffect, useState } from "react";
import { Context } from "../context/context";
import "./dashbord.css";
import toast from "react-hot-toast";

function Dashbord() {
  const [images, setImages] = useState([]);
  const { api, token } = useContext(Context);
  const [selectedSize, setSelectedSize] = useState([]);
  const [mainImg, setMainImg] = useState(null);
  const [errors,setErrors] = useState([])
  const sizes = ["xs", "s", "m", "l", "xl", "xxl"];
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
        "accept": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    .then(res=>{
      if(res.ok){
        toast.success("product added successfully")
        setErrors([])
        e.target.reset()
        setImages([])
        setMainImg(null)
        setPreview(null)
        setImagsPreview([]) 
        setSelectedSize([])
      }
      if(res.status==422){
        return res.json()
      }
    }).then(data=>data.errors&& setErrors(data.errors))
    .catch(err=>console.log(err))
  };
  const addSize = (size) => {
    if (selectedSize.includes(size)) {
      setSelectedSize(selectedSize.filter((s) => s !== size));
      return;
    }
    setSelectedSize([...selectedSize, size]);
  };
  const dlt = (img) => {
    setImages(images.filter((im) => im !== img));
  };
  const handleImgsChange = (e) => {
    const files = [...e.target.files];
    setImages([...images,...files.filter(file=>!images.includes(file))])
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
              {errors.name &&<p className="errorInp">{errors.name}</p>}
            </div>
            <div className="description">
              <label htmlFor="">Product description: </label>
              <br />
              <textarea
                name="description"
                placeholder="description"
                rows={4}
                ></textarea>
                {errors.description &&<p className="errorInp">{errors.description}</p>}
            </div>
            <div className="sizes">
              <label htmlFor="">Product sizes: </label>
              <br />
              <div className="sizesBtns">
                {sizes.map((size) => (
                  <span
                    className={`sizeBtn ${
                      selectedSize.includes(size) ? "selectedSize" : ""
                    }`}
                    key={size}
                    onClick={() => addSize(size)}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="otherInfos">
            <h2>other Infos</h2>

            <div className="addProductInofs">
              <div className="addingprice">
                <label htmlFor="">Price </label>
                <br />
                <input type="text" name="price" placeholder="price" />
                {errors.price &&<p className="errorInp">{errors.price}</p>}
              </div>
              <div className="stock">
                <label htmlFor="">Stock</label>
                <br />
                <input type="text" name="stock" placeholder="stock" />
                {errors.stock &&<p className="errorInp">{errors.stock}</p>}
              </div>
              <div className="category">
                <label htmlFor="">Category</label>
                <br />
                <input type="text" name="category" placeholder="category" />
                {errors.category &&<p className="errorInp">{errors.category}</p>}
              </div>
              <div className="discount">
                <label htmlFor="">Discount</label>
                <br />
                <input type="number" name="discount" placeholder="discount" />
                {errors.discount &&<p className="errorInp">{errors.discount}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="formRightSide">
          <div className="btnSubmit">
            <button type="submit" onSubmit={submit} className="fancy">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
              add product
            </button>
          </div>
          <label className="custum-file-upload" htmlFor="file">
            {!mainImg && (
              <>
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill=""
                    viewBox="0 0 24 24"
                  >
                    <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      id="SVGRepo_tracerCarrier"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fill=""
                        d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
                <div className="text">
                  <span>Click to upload main image</span>
                </div>
              </>
            )}
            {mainImg && <img src={URL.createObjectURL(mainImg)} alt="" />}
            <input
              type="file"
              id="file"
              name="image"
              onChange={(e) => setMainImg(e.target.files[0])}
            />
          </label>
                {errors.image &&<p className="errorInp">{errors.image}</p>}

          <div className="otherImgs">
            {images.length > 0 &&
              images.map((img) => (
                <div className="otherimgswrapper" key={img}>
                  <img src={URL.createObjectURL(img)} alt="" />
                  <span className="deleteImg" onClick={() => dlt(img)}>
                    X
                  </span>
                </div>
              ))}
            <label htmlFor="imgs">
              <span>+</span>
            </label>

            <input
              type="file"
              id="imgs"
              name="images"
              onChange={handleImgsChange}
              multiple
              />
          </div>
              {errors.images &&<p className="errorInp">{errors.images}</p>}
        </div>
      </form>
    </div>
  );
}
export default Dashbord;
