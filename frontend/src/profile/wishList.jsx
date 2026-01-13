import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { useContext } from "react";
import { Context } from "../context/context";
export default function WishList() {
  const queryClient = useQueryClient();
  const { api, userId } = useContext(Context);
  const { data: wishlistItems } = useQuery({
    queryKey: ["favourites", userId],
    queryFn: () =>
      fetch(api + "favourites" + "?user_id=" + userId, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => res.ok && res.json()),
  });
  const postTofavFN = async (id) => {
    return await fetch(`${api}favourites`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: id, user_id: userId }),
    }).then((res) => {
      if (!res.ok) throw new Error("Network error");
      return res.json();
    });
  };
  const addAndDelFav = useMutation({
    mutationFn: postTofavFN,
    onSuccess: (data) => {
      if (data == "added") {
        toast.success("Product added to favourites");
      } else {
        toast("Product removed from favourites");
      }
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
    onError: (err) => {
      toast.error("Something went wrong");
      console.log(err);
    },
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              My Wishlist
            </h2>
            <p className="text-gray-500">
              You have {wishlistItems?.length} items in your wishlist
            </p>
          </div>
          <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors font-medium">
            Clear All
          </button>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wishlistItems?.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-full h-60 object-contain"
              />
              <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors group">
                <Heart
                  className={`w-5 h-5 text-[#28708fc5] fill-[#28708fc5]`}
                />
              </button>
              {item.product.stock == 0 && (
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-lg">
                  Out of Stock
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                {item.product.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text[#28708fc5]">
                  ${item.product.price}
                </span>
                <button
                  disabled={!item.product.stock > 0}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    item.product.stock > 0
                      ? "bg-[#28708fc5] text-white hover:bg-[#28708fc5]/100"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {item.product.stock > 0 ? "Add to Cart" : "Unavailable"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
