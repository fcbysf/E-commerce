import { useContext, useEffect, useState } from "react";
import {
  User,
  Shield,
  Heart,
  Package,
  Settings,
  LogOut,
  Home,
  Users,
  Building2,
  Plus,
} from "lucide-react";
import NavBar from "../layouts/ShopNavBar";
import "./profile.css";
import { Context } from "../context/context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Security from "./security";
import WishList from "./wishList";
import ProfileOrders from "./ProfileOrders";
import ImageUploadInput from "../auth/imageUpload";

const UserProfile = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("profile");
  const { user, token, fetching, api } = useContext(Context);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    adresse: "",
  });
  const [selectedImg, setSelectedImg] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    adresse: "",
  });


  function imageSelected(image) {
    setSelectedImg(image);
  }
  useEffect(() => {
    setForm({
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      adresse: user?.adresse,
    });
    setSelectedImg(user?.image);
  }, [user]);

  // Sample data
  const userData = {
    facebook: "https://www.facebook.com/cameronw",
    instagram: "https://www.instagram.com/cameronw",
    website: "https://wpshout.com/",
    enterprise: "https://www1",
    address: "123 Main Street, New York, NY 10001",
  };

  // Navigation items
  const navItems = [
    { id: "profile", label: "Profile", icon: User, section: "account" },
    { id: "security", label: "Security", icon: Shield, section: "account" },
    { id: "wishlist", label: "Wishlist", icon: Heart, section: "account" },
    { id: "orders", label: "Orders", icon: Package, section: "account" },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut,
      section: "account",
      isAction: true,
    },
  ];
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleLogout = async () => {
    if (!window.confirm("LogOut ?")) return;
    const res = await fetch(api + "logout", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      sessionStorage.clear();
      toast.success("logged out successfully");
      fetching();
      navigate("/");
    } else {
      toast.error("something went wrong");
    }
  };
  const updateUser = (e) => {
    e.preventDefault()
  if(form.name==user?.name && form.email==user?.email && form.adresse==user?.adresse && form.phone==user?.phone && user?.image==selectedImg){
    toast.error('something went wrong')
    return
  }
  if(!confirm('Save changes ?')){
    return
  }
  const formData = new FormData(e.target)
if (selectedImg instanceof File) {
  formData.append('image', selectedImg);
}
if(selectedImg==null){
  formData.append('removeImage', '1')
}
  formData.append('_method','PUT')
  fetch(api+'user/'+user?.id, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  .then(res =>{
    if(res.ok){
      fetching()
      toast.success('updated successfully')
      setErrors({})
      return res.json()
    }
    else if(res.status == 422){
      return res.json()
    }
    throw new Error('something went wrong')
  })
  .then(data =>{
    if(data.errors){
      setErrors(data.errors)
    }
    else{
      console.log(data)
    }
  })
  .catch(err => console.log(err))
  };
  const renderProfilePage = () =>
    user && (
      <div className="space-y-6 ">
        {/* User Header */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="relative">
              <img
                src={user.image || "/defaultprf.png"}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover shadow-md"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.name}
              </h2>
              <p className="text-gray-600 mb-3">{user.email}</p>
              <div className="flex items-center gap-3">
                <div className="bg-gray-50 px-3 py-1.5 rounded-lg">
                  <span className="text-sm text-gray-600">{user.id}</span>
                </div>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <form className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm" onSubmit={updateUser}>
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="name"
                value={form?.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            {errors?.name && <small className="text-red-500 ms-3">{errors?.name}</small>}
            <div className="col-span-2">
              <label className="block text-sm text-gray-500 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  name="email"
                  value={form?.email}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            {errors?.email && <small className="text-red-500 ms-3">{errors?.email}</small>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-500 mb-2">
                Adresse
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="adresse"
                  value={form?.adresse}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            {errors?.adresse && <small className="text-red-500 ms-3">{errors?.adresse}</small>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-500 mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="phone"
                  value={form?.phone}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            {errors?.phone && <small className="text-red-500 ms-3">{errors?.phone}</small>}
            </div>
            <ImageUploadInput
              imageSelected={imageSelected}
              dejaImg={selectedImg}
              setimg={setSelectedImg}
            />
          </div>
            {errors?.image && <small className="text-red-500 ms-3">{errors?.image}</small>}
          <div className="pt-2 mt-2 col-span-1">
            <button
              className="px-6 py-2.5 bg-[#28708fc5] text-white rounded-xl hover:bg-[#28708fc5]/100 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </form>

        {/* Social Media Accounts */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Social Media Account
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={userData.facebook}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={userData.instagram}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#28708fc5] text-white rounded-xl hover:bg-[#28708fc5]/100 transition-colors font-medium">
              <Plus className="w-4 h-4" />
              Add Social Media
            </button>
          </div>
        </div>

      
      </div>
    );

  const renderSecurityPage = () => <Security />;

  const renderWishlistPage = () => <WishList />;

  const renderOrdersPage = () => <ProfileOrders user={user} />;


  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        
        * {
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      {/* Top Header */}
      <NavBar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 sticky my-3 z-50 rounded-md bg-white border-r border-gray-200 h-[100vh] overflow-hidden top-5">
          <nav className="p-6">
            {/* Account Section */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Account
              </p>
              <div className="space-y-1 ">
                {navItems
                  .filter((item) => item.section === "account")
                  .map((item) => (
                    <label
                      key={item.id}
                      onClick={() => {
                        if (item.isAction) {
                          handleLogout();
                        } else {
                          setActivePage(item.id);
                        }
                      }}
                      className={`w-full text-sm flex items-center border-0 gap-3 px-4 py-2.5 rounded-xl transition-all ${
                        activePage === item.id
                          ? "bg-[#76bbd81a] text-[#287191]"
                          : item.id === "logout"
                          ? "text-red-600 bg-white hover:bg-red-50  bottom-0"
                          : "text-gray-600 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </label>
                  ))}
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-5xl">
            {activePage === "profile" && renderProfilePage()}
            {activePage === "security" && renderSecurityPage()}
            {activePage === "wishlist" && renderWishlistPage()}
            {activePage === "orders" && renderOrdersPage()}
            {activePage === "settings" && renderSettingsPage()}
            {activePage === "home" && (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <Home className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome Home
                </h2>
                <p className="text-gray-500">
                  Select a section from the sidebar to get started
                </p>
              </div>
            )}
            {activePage === "users" && (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Users Management
                </h2>
                <p className="text-gray-500">
                  User management features coming soon
                </p>
              </div>
            )}
            {activePage === "organizations" && (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <Building2 className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Organizations
                </h2>
                <p className="text-gray-500">
                  Organization management features coming soon
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
