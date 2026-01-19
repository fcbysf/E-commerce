import { useParams } from "react-router-dom"
import MarketplaceSideBar from "./marketplaceSideBar"
import "../profile/profile.css";
import NavBar from "../layouts/ShopNavBar";
import MarketplacePage from "./MarketplacePage";
import UserListings from "./userListings";

export default function MarkttPlaceLayout() {
    const { place } = useParams()
    return (
        <div className="h-screen bg-gray-50 ">
            <NavBar />
            <div className="flex  bg-gray-50 gap-3 mt-2 listingsContainer ">
                <MarketplaceSideBar />
                {location.pathname === '/marketplace' && <MarketplacePage />}
                {place=== 'selling' && <UserListings />}
            </div>
        </div>
    )

}