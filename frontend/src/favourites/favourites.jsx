import { useContext, useEffect, useState } from "react";
import { Context } from "../context/context";
import NavBar from "../layouts/ShopNavBar";
import "./favourite.css";
import { useNavigate } from "react-router-dom";

export default function Favourites(){
    const navigate =useNavigate()
    const [favourites, setFavourites] = useState([]);
    const {api,userId} = useContext(Context)
    function fetchFav(){
        fetch(api + "favourites", {
            headers:{
                accept: "application/json",
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.ok && res.json())
            .then((data) => setFavourites(data))
            .catch((err) => console.log(err));
            }
    
    useEffect(()=>{
        fetchFav();
    },[])
    return (
        <div className="FavouritesController">
            <NavBar />
            <div className="favourites">
                <h1>Favourites</h1>
                <div className="favouritesP">
                {
                    favourites.map(f=>(
                        <div className="oneFavourite" key={f.id} onClick={()=>navigate(`/product/${f.product_id}`)}>
                            <img src={f.product.image} alt="" />
                            <p>{f.product.name}</p>
                            <i>$ {f.product.price}</i>

                        </div>
                    ))
                }   
                </div>
            </div>
        </div>
    )
}