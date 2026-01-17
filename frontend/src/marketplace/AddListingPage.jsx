import React, { useState, useEffect } from "react";
import {
  X,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  MapPin,
} from "lucide-react";
import { useContext } from "react";
import { Context } from "../context/context";
import "../profile/profile.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import NavBar from "../layouts/ShopNavBar";
import { useNavigate } from "react-router-dom";

const AddListingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    condition: "",
    description: "",
    location: "",
  });

  const [images, setImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const maxImages = 10;
  const { api, token, user } = useContext(Context);
  const queryClient = useQueryClient();

  const categories = [
    { value: "", label: "Select a category", icon: null },
    { value: "vehicles", label: "Vehicles", icon: Car },
    { value: "property-for-rent", label: "Property for rent", icon: Home },
    { value: "apparel", label: "Apparel", icon: Shirt },
    { value: "classifieds", label: "Classifieds", icon: FileText },
    { value: "electronics", label: "Electronics", icon: Smartphone },
    { value: "entertainment", label: "Entertainment", icon: Gamepad2 },
    { value: "family", label: "Family", icon: Baby },
    { value: "free-stuff", label: "Free Stuff", icon: Gift },
    { value: "garden-outdoor", label: "Garden & Outdoor", icon: Flower2 },
    { value: "hobbies", label: "Hobbies", icon: Palette },
    { value: "home-goods", label: "Home Goods", icon: Sofa },
    { value: "home-improvement", label: "Home Improvement", icon: Hammer },
    { value: "pet-supplies", label: "Pet Supplies", icon: PawPrint },
    { value: "sporting-goods", label: "Sporting Goods", icon: Trophy },
    { value: "toys-games", label: "Toys & Games", icon: Puzzle },
  ];

  const conditions = [
    { value: "", label: "Select condition" },
    { value: "new", label: "✨ New" },
    { value: "like_new", label: "🌟 Like New" },
    { value: "good", label: "👍 Good" },
    { value: "fair", label: "👌 Fair" },
    { value: "poor", label: "⚠️ Poor" },
  ];

  // Keyboard navigation for preview swiper
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (images.length <= 1) return;

      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, previewIndex]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} photos`);
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (previewIndex >= newImages.length && newImages.length > 0) {
      setPreviewIndex(newImages.length - 1);
    } else if (newImages.length === 0) {
      setPreviewIndex(0);
    }
  };

  const goToPrevious = () => {
    setPreviewIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setPreviewIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const { mutate: addListing } = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(api + "listing", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Listing added successfully");
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      setErrors({});
      setFormData({
        title: "",
        price: "",
        category: "",
        condition: "",
        description: "",
        location: "",
      });
      setImages([]);
    },
    onError: (error) => {
      setErrors(error.errors);
      toast.error("something went wrong");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataSubmit = new FormData();
    formDataSubmit.append("title", formData.title);
    formDataSubmit.append("price", formData.price);
    formDataSubmit.append("category", formData.category);
    formDataSubmit.append("condition", formData.condition);
    formDataSubmit.append("location", formData.location);
    formDataSubmit.append("description", formData.description);

    images.forEach((image) => {
      formDataSubmit.append("images[]", image.file);
    });

    addListing(formDataSubmit);
  };

  const getCategoryIcon = () => {
    const category = categories.find((cat) => cat.value === formData.category);
    return category?.icon;
  };

  const getCategoryLabel = () => {
    const category = categories.find((cat) => cat.value === formData.category);
    return category?.label || "Category";
  };

  const getConditionLabel = () => {
    const condition = conditions.find(
      (cond) => cond.value === formData.condition,
    );
    return condition?.label || "Condition";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex h-screen mt-3 gap-4">
        {/* Left Side - Form */}
        <div className="w-[420px] bg-white border-r border-gray-200 overflow-y-auto shadow-sm scroll-w">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div
                  className="text-[#0d5270de] mb-1 uppercase tracking-wide text-xl cursor-pointer"
                  onClick={() => navigate("/marketplace")}
                >
                  Marketplace
                </div>

              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3  pb-4 border-b border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                <img
                  src={user?.image || "/defaultprf.png"}
                  alt="user img"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 m-0">
                  {user?.name}
                </h3>
                <small className="text-xs text-gray-600 flex items-center gap-1">
                  Listing to Marketplace ·
                </small>
              </div>
            </div>

            {/* Photos Upload */}
            <div className="">
              <div className="text-sm font-semibold text-gray-900 mb-2 ">
                Photos{" "}
                <span className="text-[#26799c]">
                  · {images.length}/{maxImages}
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-3">
                You can add up to {maxImages} photos.
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={image.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 bg-gray-900/80 hover:bg-gray-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1.5 left-1.5 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        Primary
                      </div>
                    )}
                  </div>
                ))}

                {images.length < maxImages && (
                  <label className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                    <Camera className="w-7 h-7 text-gray-400 group-hover:text-[#1b5974] mb-1 transition-colors" />
                    <span className="text-xs text-gray-600 group-hover:text-[#1b5974] font-medium transition-colors">
                      Add
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Required Section */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg m-0 p-0">
                  Required
                </h3>
                <p className="text-sm text-gray-600 my-2 p-0">
                  Be as descriptive as possible.
                </p>

                {/* Title */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData?.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={`w-[320px] px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all '
                    }`}
                  />
                  {errors?.title && (
                    <small className="text-red-500 ms-3">{errors?.title}</small>
                  )}
                </div>
                {/* Price */}
                <div className="mb-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                      MAD
                    </span>
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      value={formData?.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className={`w-[273px] pl-16 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                      }`}
                    />
                  </div>
                  {errors?.price && (
                    <div className="flex items-center gap-1 mt-2 text-red-600 text-sm font-medium">
                      <span className="ms-3">{errors?.price}</span>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="mb-1 relative">
                  <select
                    value={formData?.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    style={{ border: "2px solid whitesmoke", outline: 0 }}
                    className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#439ec538] focus:border-transparent cursor-pointer transition-all'
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>

                  {formData?.category &&
                    getCategoryIcon() &&
                    React.createElement(getCategoryIcon(), {
                      className:
                        "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none",
                    })}
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
                  <label className="absolute left-4 -top-2.5 bg-white px-2 text-xs font-semibold text-gray-700">
                    Category
                  </label>
                </div>
                {errors?.category && (
                  <small className="text-red-500 ms-3">
                    {errors?.category}
                  </small>
                )}

                {/* Condition */}
                <div className="my-6 relative">
                  <select
                    value={formData?.condition}
                    style={{ border: "2px solid whitesmoke", outline: 0 }}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value })
                    }
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#439ec538]focus:border-transparent cursor-pointer hover:border-gray-300 transition-all"
                  >
                    {conditions.map((cond) => (
                      <option key={cond.value} value={cond.value}>
                        {cond.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
                  <label className="absolute left-4 -top-2.5 bg-white px-2 text-xs font-semibold text-gray-700">
                    Condition
                  </label>
                </div>

                {/* Description */}
                <div className="mb-4 relative">
                  <textarea
                    placeholder="Describe your item..."
                    rows="5"
                    value={formData?.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-11/12 px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#439ec538] focus:border-transparent resize-none hover:border-gray-300 transition-all"
                    style={{ border: "2px whitesmoke solid", outline: 0 }}
                  />
                  <label className="absolute left-4 -top-2.5 bg-white px-2 text-xs font-semibold text-gray-700">
                    Description
                  </label>
                  {errors?.description && (
                    <small className="text-red-500 ms-3">
                      {errors?.description}
                    </small>
                  )}
                </div>

                {/* Location */}
                <div className="mb-1 relative">
                  <input
                    type="text"
                    placeholder="Ville, Rue"
                    value={formData?.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-[299px] pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300 transition-all"
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
                  <label className="absolute left-4 -top-2.5 bg-white px-2 text-xs font-semibold text-gray-700">
                    Location
                  </label>
                </div>
                {errors?.location && (
                  <small className="text-red-500 ms-3">
                    {errors?.location}
                  </small>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 rounded-xl font-bold transition-all text-lg ${
                  formData?.title && formData?.price && formData?.category
                    ? "bg-[#206e8f] hover:bg-[#1d546c] text-white shadow-md hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                // disabled={!formData?.title || !formData?.price || !formData?.category}
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="flex-1  overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 p-2 overflow-y-hidden">
              <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex">
                  {/* Left - Image Section */}
                  <div className="w-[60%] bg-gray-100 relative">
                    {images.length > 0 ? (
                      <>
                        <div className="aspect-square flex items-center justify-center p-4">
                          <img
                            src={images[previewIndex].preview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>

                        {/* Image Counter */}
                        {images.length > 1 && (
                          <div className="absolute top-4 right-4 bg-black text-white px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm opacity-40">
                            {previewIndex + 1} / {images.length}
                          </div>
                        )}

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={goToPrevious}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                            >
                              <ChevronLeft className="w-6 h-6 text-gray-900" />
                            </button>
                            <button
                              onClick={goToNext}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                            >
                              <ChevronRight className="w-6 h-6 text-gray-900" />
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="aspect-square flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">No photos</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right - Details Section */}
                  <div className="flex-1 px-6 overflow-y-auto max-h-[600px]">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {formData?.title || "Title"}
                    </h2>
                    <div className="text-2xl font-semibold text-gray-700 mb-2">
                      {formData?.price ? `MAD ${formData?.price}` : "Price"}
                    </div>
                    <div className="text-sm text-gray-600 mb-6">
                      Listed a few seconds ago in{" "}
                      {formData?.location || "الدار البيضاء"}
                    </div>

                    <div className="border-t border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-3 text-2xl">
                        Details
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {formData?.description ||
                          "Description will appear here."}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 ">
                      <hr className="bg-black/40 h-[0.5px] mt-10" />
                      <div className="flex items-center justify-between mt-10">
                        <h3 className="font-semibold text-gray-900 my-1">
                          Seller information
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <img
                            src={user?.image || "/defaultprf.png"}
                            alt="image"
                            className="w-12 h-12 rounded-full"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {user?.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddListingPage;
