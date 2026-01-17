import {
  Search,
  Settings,
  Bell,
  MessageSquare,
  ShieldCheck,
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
} from "lucide-react";
import "../profile/profile.css";
import { useNavigate } from "react-router-dom";
import NavBar from "../layouts/ShopNavBar";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { Context } from "../context/context";

const MarketplacePage = () => {
  const navigate = useNavigate();
  const {api, token} = useContext(Context)
  const menuItems = [
    { name: "Browse all", icon: Search, active: true },
    { name: "Notifications", icon: Bell },
    { name: "Inbox", icon: MessageSquare },
    { name: "Marketplace access", icon: ShieldCheck },
    { name: "Buying", icon: ShoppingBag, hasSubmenu: true },
    { name: "Selling", icon: Tag, hasSubmenu: true },
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

  const { data, error, isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      const res= await fetch(api + "listing", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      // .then(res=>{
      //   if(res.ok) return res.json()
      //   else throw Error("Something went wrong")
      // });
      if (!res.ok) {
        throw "Something went wrong";
      }
      return res.json();
    },
  });

  const products = useMemo(
    () => data?.data ?? [],
    [data]
  );
  // const products = [
  //   {
  //     id: 1,
  //     title: "Kangoo dci 2012 06*68*87*94*71",
  //     price: "MAD77,000",
  //     image:
  //       "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=600&fit=crop",
  //     location: "Casablanca, Morocco",
  //     justListed: false,
  //   },
  //   {
  //     id: 2,
  //     title: "Air tag original apple",
  //     price: "MAD320",
  //     image:
  //       "https://images.unsplash.com/photo-1591290619762-d118c33d2e11?w=600&h=600&fit=crop",
  //     location: "Casablanca, Morocco",
  //     justListed: false,
  //   },
  //   {
  //     id: 3,
  //     title:
  //       "خرط فرس خارجة عبر هوا خاصو راقم كنت ديجة صويت نكلا علي رقم 3000 درهم فيكس",
  //     price: "MAD3,000",
  //     image:
  //       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
  //     location: "Casablanca, Morocco",
  //     justListed: true,
  //   },
  //   {
  //     id: 4,
  //     title: "Modern Office Desk Setup",
  //     price: "MAD4,500",
  //     image:
  //       "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=600&fit=crop",
  //     location: "Casablanca, Morocco",
  //     justListed: false,
  //   },
  //   {
  //     id: 5,
  //     title: "Colorful Blankets Set",
  //     price: "MAD850",
  //     image:
  //       "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=600&fit=crop",
  //     location: "Casablanca, Morocco",
  //     justListed: true,
  //   },
  //   {
  //     id: 6,
  //     title: "Black Hiking Boots",
  //     price: "MAD1,200",
  //     image:
  //       "https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=600&h=600&fit=crop",
  //     location: "Casablanca, Morocco",
  //     justListed: false,
  //   },
  //   {
  //     id: 7,
  //     title: "Gaming Setup RGB Complete",
  //     price: "MAD8,500",
  //     image:
  //       "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=600&fit=crop",
  //     location: "Maarif, Casablanca",
  //     justListed: false,
  //   },
  //   {
  //     id: 8,
  //     title: "Vintage Leather Sofa",
  //     price: "MAD2,800",
  //     image:
  //       "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
  //     location: "Ain Chock, Casablanca",
  //     justListed: true,
  //   },
  //   {
  //     id: 9,
  //     title: "Professional Camera Canon",
  //     price: "MAD6,200",
  //     image:
  //       "https://images.unsplash.com/photo-1606980702020-9315f2a66a10?w=600&h=600&fit=crop",
  //     location: "California, Casablanca",
  //     justListed: false,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex h-screen bg-gray-50 gap-3 mt-2">
        {/* Sidebar */}
        <aside className="w-[340px] bg-white border-r border-gray-200 overflow-y-auto h-screen flex-shrink-0 scroll-w">
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
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-2 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      item.active ? "bg-blue-50" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          item.active ? "bg-[#1d546c]/60" : "bg-gray-200"
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
                  </div>
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

        {/* Main Content */}
        <div className="flex-1 bg-white overflow-y-auto rounded-md">
          <div className="max-w-6xl mx-auto py-2 px-4">
            {/* Header */}
            <div className="flex items-center justify-between ">
              <h2 className="text-2xl font-bold text-gray-900">
                Today's picks
              </h2>
              <div className="text-sm text-blue-600 cursor-pointer hover:underline">
                📍 km 65 · الدار البيضاء
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products?.map((product) => (
                <div
                  key={product.id}
                  onClick={()=>navigate(`/marketplace/product/${product.id}`)}
                  className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg  transition-shadow"
                >
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.images[0].image}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-all"
                    />
                    {product.justListed && (
                      <div className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded text-xs font-medium shadow-md">
                        Just listed
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {product.price} DH 
                    </div>
                    <div className="text-sm text-gray-900 mb-1 line-clamp-2">
                      {product.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {product.city}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
