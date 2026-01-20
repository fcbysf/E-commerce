import { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  MoreHorizontal,
  MapPin,
  Info,
  LucideMessageCircle,
} from "lucide-react";
import "../profile/profile.css";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../layouts/ShopNavBar";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useContext } from "react";
import { Context } from "../context/context";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const ProductDetailPage = () => {
  const { api, token, user } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(`Bonjour, cet article est-il toujours disponible ?`);

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      return await fetch(api + "listing/" + id, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (res.ok) return res.json();
        else throw Error("Something went wrong");
      });
    },
  });


  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = product?.images.length > 1;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!hasMultipleImages) return;

      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        console.log("Close modal");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, hasMultipleImages]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? product?.images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === product?.images.length - 1 ? 0 : prevIndex + 1,
    );
  };
  return (
    <div className="fixed inset-0 bg-gray-50 z-50 ">
      <NavBar />
      <div className="flex h-full mt-3 gap-4">
        {/* Left Side - Image Section */}
        <div className="flex-1 bg-gray-50 relative flex flex-col">
          {/* Close Button */}
          <button
            className="absolute top-4 left-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-20 transition-colors"
            onClick={() => navigate(-1)}
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>

          {/* Image Counter - Only show if multiple images */}
          {hasMultipleImages && (
            <div className="absolute top-4 right-4 bg-black/50  text-white/80 px-3 py-1.5 rounded-full text-sm font-medium z-20 ">
              {currentIndex + 1} / {product?.images.length}
            </div>
          )}

          {/* Main Image Display */}
          <div className="flex-1 flex justify-center ps-3 relative">
            <img
              src={product?.images[currentIndex].image}
              alt={`Product ${currentIndex + 1}`}
              className="w-full h-[580px] object-contain rounded-lg"
            />

            {/* Navigation Arrows - Only show if multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-7 bottom-[50%] -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-7 bottom-[50%]  -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                >
                  <ChevronRight className="w-6 h-6 text-gray-900" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation - Only show if multiple images */}
          {hasMultipleImages && (
            <div className="bg-black/80 p-4">
              <div className="flex gap-2 overflow-auto justify-center">
                {product?.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex
                      ? "border-white"
                      : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-fit h-fit object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Product Details */}
        <div className="w-[460px] bg-white rounded-md overflow-y-auto flex-shrink-0 border-l border-gray-200">
          <div className="px-6 ">
            {/* Product Title and Price */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product?.title}
              </h1>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                MAD {product?.price}
              </div>
              <div className="text-sm text-gray-600">
                Listed {dayjs(product?.created_at).fromNow()} in {product?.city}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Bookmark className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-900">Save</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-900">Share</span>
              </button>
              <button className="w-11 h-11 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Details Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
              <div className="space-y-2">
                <p className="text-gray-700 text-[15px] leading-relaxed">
                  {product?.description}
                </p>
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                {/* Map placeholder with gradient */}
                <div className="h-52 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 relative flex items-center justify-center">
                  {/* Decorative map elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-8 left-12 w-24 h-24 border-2 border-blue-400 rounded-full"></div>
                    <div className="absolute bottom-12 right-16 w-16 h-16 border-2 border-blue-300 rounded-full"></div>
                    <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>

                  {/* Center pin */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                      <MapPin className="w-10 h-10 text-white fill-white" />
                    </div>
                    {/* Outer ring */}
                    <div className="absolute w-32 h-32 bg-blue-600/20 rounded-full animate-ping"></div>
                  </div>

                  {/* Info button */}
                  <div className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Info className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-gray-900 mb-1">
                    {product?.city}
                  </div>
                  <div className="text-xs text-gray-600">
                    Location is approximate
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="mb-[100px]">
              <h3 className="font-semibold text-gray-900 mb-4">
                Seller information
              </h3>

              <div className="flex items-center gap-3 ">
                <img
                  src={product?.user?.image || '/defaultprf.png'}
                  alt={product?.user?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {product?.user?.name}
                  </div>
                </div>
                <small className="text-gray-700 max-w-28">joined in {dayjs(product?.user?.created_at).year()}</small>

              </div>
            </div>
          </div>
          {/* Quick Message */}
          {product?.user?.id !== user?.id &&
            <div className="px-6 bg-gray-50  sticky bottom-24 z-50 shadow-lg !border-t !border-gray-400 !border-solid">
              <div>
                <p className="flex items-center gap-2">
                  <LucideMessageCircle className="w-5 h-5 "/>
                  send message to {product?.user?.name}
                </p>
              </div>
              <textarea className="text-sm min-w-[380px] max-w-[380px] px-2 py-2 min-h-16 rounded-xl text-black mb-3 !border !border-gray-300 !border-solid resize-none" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Your Message" />

              <button className="w-full cursor-pointer bg-[#357f9ef1] hover:bg-[#2e7594f1] text-white text-center font-semibold py-2.5 rounded-lg transition-colors">
                Send
              </button>
            </div>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
