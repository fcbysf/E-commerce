import { useContext, useEffect, useState } from "react"
import "./adminProducts.css"
import { Context } from "../context/context"
export default function AdminProducts(){
    const [products, setProducts] = useState([])
    const {api, token} = useContext(Context)
    useEffect(()=>{
        fetch(`${api}adminProducts`,{
            headers:{
                accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(res=>res.json())
        .then(data=>setProducts(data))
        .catch(err=>console.log(err))
    },[])
    return(
        <div className="adminProductsContainer">
            <h1>admin products</h1>
        </div>
    )
}