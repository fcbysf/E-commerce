import{ NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Settings,
  Bell,
  MessageSquare,
  ShoppingBag,
  Tag,
  ChevronRight,
  Plus,
  Car,
  Home,
  Shirt,
  FileText,
  Smartphone,
  Gamepad2,
  Baby,
  Gift,
  Flower2,
  Palette,
  Sofa,
  Hammer,
  PawPrint,
  Trophy,
  Puzzle,
}
from "lucide-react";
export default function MarketplaceSideBar(){
    const navigate = useNavigate();
      const menuItems = [
    { name: "Browse all", icon: Search, navigate : "/marketplace" },
    { name: "Notifications", icon: Bell,navigate : "/marketplace/notifications"},
    { name: "Inbox", icon: MessageSquare, navigate : "/marketplace/inbox"},
    { name: "Buying", icon: ShoppingBag, hasSubmenu: true, navigate : "/marketplace/buying"},
    { name: "Selling", icon: Tag, hasSubmenu: true,navigate : "/marketplace/selling"},
  ];
    const categories = [
    { name: "Vehicles", icon: Car },
    { name: "Property for rent", icon: Home },
    { name: "Apparel", icon: Shirt },
    { name: "Classifieds", icon: FileText },
    { name: "Electronics", icon: Smartphone },
    { name: "Entertainment", icon: Gamepad2 },
    { name: "Family", icon: Baby },
    { name: "Free Stuff", icon: Gift },
    { name: "Garden & Outdoor", icon: Flower2 },
    { name: "Hobbies", icon: Palette },
    { name: "Home Goods", icon: Sofa },
    { name: "Home Improvement", icon: Hammer },
    { name: "Pet Supplies", icon: PawPrint },
    { name: "Sporting Goods", icon: Trophy },
    { name: "Toys & Games", icon: Puzzle },
  ];
  return(
        <aside className="w-[340px] bg-white mt-1 border-r border-gray-200 overflow-y-auto h-screen flex-shrink-0 scroll-w sticky top-0" >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-[#1d546c]">Marketplace</h1>
              <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <Settings className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search Marketplace"
                className="w-4/5 pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-gray-200 transition-colors"
              />
            </div>

            {/* Menu Items */}
            <div className="space-y-1 mb-6">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={idx}
                    end
                    to={decodeURIComponent(item.navigate)}
                    className={`flex items-center  justify-between px-2 py-2.5 rounded-lg cursor-pointer no-underline transition-colors`}
                    style={({isActive})=>isActive&&{backgroundColor:'#eff6ff'}||{}}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${item.active ? "bg-[#1d546c]/60" : "bg-gray-200"
                          }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${item.active ? "text-white" : "text-gray-700"}`}
                        />
                      </div>
                      <span
                        className={`font-medium text-[15px] ${item.active ? "text-[#3195c0]" : "text-gray-900"}`}
                      >
                        {item.name}
                      </span>
                    </div>
                    {item.hasSubmenu && (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Create New Listing */}
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 text-[#1d546c] hover:bg-gray-100 rounded-lg font-medium mb-6 transition-colors"
              onClick={() => navigate("/marketplace/addListing")}
            >
              <Plus className="w-5 h-5" />
              Create new listing
            </button>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 px-2">
                Location
              </h3>
              <div className="text-sm text-[#1d546c] cursor-pointer hover:underline px-2">
                Casablanca, Morocco · Within 65 km
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-gray-700" />
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
  )
}