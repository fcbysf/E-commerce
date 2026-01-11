import { useContext, useEffect, useState } from "react";
import "./adminProducts.css";
import { Context } from "../context/context";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export default function AdminProducts() {
  const navigate = useNavigate();
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

  // FETCH PRODUCTS
  const queryClient = useQueryClient();
  async function fetching() {
    return await fetch(`${api}adminProducts`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  }
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetching,
  });

  // DELETE PRODUCT
  const { mutate } = useMutation({
    mutationFn: (id) =>
      fetch(`${api}product/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (res.ok) {
          return res.json();
        } else throw Error("error deleting product");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("product deleted successfully");
    },
    onError: () => {
      toast.error("error deleting product, try again later");
    },
  });
  const del = (id) => {
    if (!confirm("are you sure you want to delete this product?")) return;
    mutate(id);
  };
  return (
    <div className="adminProductsContainer">
      <div className="filterAndTitle">
        <h1>
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
            class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-bag"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z" />
            <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
          </svg>
          Products
        </h1>
        <div className="filtersCon">
          <div className="filter">
            <p>category: </p>
            <select onChange={(e) => setCategory(e.target.value)}>
              {categories.map((category) => (
                <option value={category}>{category}</option>
              ))}
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
              <th>
                <span className="prdctclmn">
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
                    class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    <path d="M17 17h-11v-14h-2" />
                    <path d="M6 5l14 1l-1 7h-13" />
                  </svg>
                  Product{" "}
                </span>{" "}
              </th>
              <th>
                <span className="prdctclmn">
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
                    class="icon icon-tabler icons-tabler-outline icon-tabler-category"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 4h6v6h-6z" />
                    <path d="M14 4h6v6h-6z" />
                    <path d="M4 14h6v6h-6z" />
                    <path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  </svg>
                  Category
                </span>
              </th>
              <th>
                <span className="prdctclmn">
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
                    class="icon icon-tabler icons-tabler-outline icon-tabler-grid-3x3"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 8h18" />
                    <path d="M3 16h18" />
                    <path d="M8 3v18" />
                    <path d="M16 3v18" />
                  </svg>
                  Id
                </span>
              </th>
              <th>
                <span className="prdctclmn">
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
                    class="icon icon-tabler icons-tabler-outline icon-tabler-coin"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                    <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" />
                    <path d="M12 7v10" />
                  </svg>
                  Price
                </span>
              </th>
              <th>
                <span className="prdctclmn">
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
                    class="icon icon-tabler icons-tabler-outline icon-tabler-stack-3"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 2l-8 4l8 4l8 -4l-8 -4" />
                    <path d="M4 10l8 4l8 -4" />
                    <path d="M4 18l8 4l8 -4" />
                    <path d="M4 14l8 4l8 -4" />
                  </svg>
                  Stock
                </span>
              </th>
              <th>
                <span className="prdctclmn">
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
                    class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-plus"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5" />
                    <path d="M16 3v4" />
                    <path d="M8 3v4" />
                    <path d="M4 11h16" />
                    <path d="M16 19h6" />
                    <path d="M19 16v6" />
                  </svg>
                  Date
                </span>
              </th>
              <th>
                <span className="prdctclmn">
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
                    class="icon icon-tabler icons-tabler-outline icon-tabler-activity"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 12h4l3 8l4 -16l3 8h4" />
                  </svg>
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.length === 0 && <p>no products found</p>}
            {products?.map(
              (p) =>
                (category === "all categories" || category === p.category) && (
                  <tr key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
                    <td className="prdctclmn">
                      <img src={p.image} alt="" />
                      <p>{p.name}</p>
                    </td>
                    <td>{p.category}</td>
                    <td>{p.id}</td>
                    <td>${p.price}</td>
                    <td>{p.stock}</td>
                    <td>{dayjs(p.createdAt).toString().slice(4, 17)}</td>
                    <td>
                      <div
                        className="svgs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          onClick={() => navigate(`/product/${p.id}`)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="icon icon-tabler icons-tabler-outline icon-tabler-eye"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                          <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                        </svg>
                        <svg
                          onClick={() => navigate(`/admin/editProduct/${p.id}`)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                          <path d="M13.5 6.5l4 4" />
                        </svg>
                        <svg
                          onClick={() => del(p.id)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M4 7l16 0" />
                          <path d="M10 11l0 6" />
                          <path d="M14 11l0 6" />
                          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
