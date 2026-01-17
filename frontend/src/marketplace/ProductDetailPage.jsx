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
} from "lucide-react";
import "../profile/profile.css";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../layouts/ShopNavBar";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useContext } from "react";
import { Context } from "../context/context";
const ProductDetailPage = () => {
  const queryClient = useQueryClient();
  const { api, token } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();

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

  // const product = {
  //   id: 1,
  //   title: "Kangoo dci 2012 06*68*87*94*71",
  //   price: "MAD77,000",
  //   location: "الدار البيضاء, المغرب",
  //   listedDate: "6 days ago",
  //   description:
  //     "Je met en vente une belle voiture Renault kangoo dCi modèle 2012 tout option 6ch diesel Nmra dyali (...See more)",
  //   images: [
  //     "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&h=900&fit=crop",
  //     "https://images.unsplash.com/photo-1611821064430-4a1e4e4f6c1a?w=1200&h=900&fit=crop",
  //     "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=900&fit=crop",
  //     "https://images.unsplash.com/photo-1583267746897-c554a0084dc3?w=1200&h=900&fit=crop",
  //     "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=1200&h=900&fit=crop",
  //     "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&h=900&fit=crop",
  //     "https://images.unsplash.com/photo-1612538498613-d0c936720d88?w=1200&h=900&fit=crop",
  //     "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&h=900&fit=crop",
  //   ],
  //   // Single image scenario - uncomment to test
  //   // images: [
  //   //   'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&h=900&fit=crop'
  //   // ],
  //   seller: {
  //     name: "Atif",
  //     avatar: "https://i.pravatar.cc/150?img=12",
  //     responseTime: "Usually responds within an hour",
  //   },
  // };

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
              className="w-full h-[57%] object-contain rounded-lg "
            />

            {/* Navigation Arrows - Only show if multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-7 bottom-[70%] -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-7 bottom-[70%]  -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                >
                  <ChevronRight className="w-6 h-6 text-gray-900" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation - Only show if multiple images */}
          {hasMultipleImages && (
            <div className="bg-black/80 p-4">
              <div className="flex gap-2 overflow-x-auto justify-center">
                {product?.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentIndex
                        ? "border-white"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Product Details */}
        <div className="w-[460px] bg-white rounded-md overflow-y-auto flex-shrink-0 border-l border-gray-200 overflow-hidden">
          <div className="px-6 ">
            {/* Product Title and Price */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product?.title}
              </h1>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {product?.price}
              </div>
              <div className="text-sm text-gray-600">
                Listed {product?.listedDate} in {product?.location}
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
            <div>
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
                <button className="text-blue-600 text-sm font-medium hover:underline">
                  Seller details
                </button>
              </div>
            </div>
          </div>
          {/* Quick Message */}
          <div className="px-4 py-2 bg-gray-50  sticky rounded-lg  bottom-0 z-50 shadow-lg">
            <div>
              <p className="flex items-center">
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
                  class="icon icon-tabler icons-tabler-outline icon-tabler-message-circle"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" />
                </svg>
                send message to {product?.user?.name}{" "}
              </p>
            </div>
            <div className="text-sm text-gray-700 mb-3 leading-relaxed">
              Bonjour {product?.user?.name}, cet article est-il toujours
              disponible ?
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-2.5 rounded-lg transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
