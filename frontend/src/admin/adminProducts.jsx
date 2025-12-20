import { useContext, useEffect, useState } from "react";
import "./adminProducts.css";
import { Context } from "../context/context";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import toast from "react-hot-toast";
export default function AdminProducts() {
  const navigate = useNavigate()  
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all categories");
  const [search, setSearch] = useState("");
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
  const { api, token } = useContext(Context);
  function fetching(){
    fetch(`${api}adminProducts`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    fetching();
  }, []);
  const del = (id) => {
    fetch(`${api}product/${id}`, {
      method: "DELETE",
      headers:{
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) =>{
        if(res.ok){
          fetching();
          toast.success('product deleted successfully');
        }
      })
      .catch((err) => console.log(err));
}
  return (
    <div className="adminProductsContainer">
      <div className="filterAndTitle">
        <h1><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-bag"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" /><path d="M9 11v-5a3 3 0 0 1 6 0v5" /></svg>Products</h1>
        <div className="filtersCon">
          <div className="filter">
            <p>category: </p>
            <select
              onChange={(e) => setCategory(e.target.value)}
            >
              {
                categories.map((category) => (
                  <option value={category}>{category}</option>
                ))
              }
            </select>
          </div>
          <div class="input-container">
            <input
              type="text"
              placeholder="Search Product"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>{" "}
        <div className="adminProducts">

            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Id</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {products.length===0&& <p>no products found</p>} 
                    {
                        products.map(p=>(
                          (category==="all categories" || category===p.category)&&
                          <tr key={p.id} onClick={()=>navigate(`/product/${p.id}`)}>
                                <td className="prdctclmn">
                                    <img src={p.image} alt="" />
                                    <p>{p.name}</p>
                                </td>
                                <td>{p.category}</td>
                                <td>{p.id}</td>
                                <td>${p.price}</td>
                                <td>{p.stock}</td>
                                <td>{dayjs(p.createdAt).toString().slice(4,17)}</td>
                                <td>
                                  <div className="svgs" onClick={(e)=>e.stopPropagation()}>
                                    <svg onClick={()=>navigate(`/product/${p.id}`)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                                    <svg  onClick={()=>navigate(`/admin/editProduct/${p.id}`)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                                    <svg onClick={()=>del(p.id)}  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                  </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    </div>
  );
}
