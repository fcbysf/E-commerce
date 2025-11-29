import { useContext, useState } from "react";
import { Context } from "../context/context";

export default function AdminPanel() {
  const [images, setImages] = useState([]);
  const { api, token } = useContext(Context);
  const submit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    console.log(payload);
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

  return (
    <form onSubmit={submit} encType="multipart/form-data">
      <input type="text" name="name" placeholder="name" />
      <input type="text" name="description" placeholder="description" />
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
    </form>
  );
}
