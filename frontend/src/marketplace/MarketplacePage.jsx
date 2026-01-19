
import { useNavigate } from "react-router-dom";
import NavBar from "../layouts/ShopNavBar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useEffect, useMemo } from "react";
import { Context } from "../context/context";
import Loader from "../layouts/loader";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { api, token } = useContext(Context)
  const { ref, inView } = useInView({ threshold: 0.5 });



  // Ferch Listings
  const { data, error, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["listings"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(api + `listing?page=${pageParam}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        throw "Something went wrong";
      }
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined,
    staleTime: 30000,
  });
  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage)
      fetchNextPage();
  }, [fetchNextPage, inView, hasNextPage, isFetchingNextPage]);
  const products = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );
  if (isPending) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  if (error) {
    toast.error("something went wrong");
  }

  return (
    <div className="flex-1 bg-white overflow-y-scroll rounded-md mt-1">
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
              onClick={() => navigate(`/marketplace/product/${product.id}`)}
              className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg  transition-shadow"
            >
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.images[0].image}
                  alt={product.title}
                  className="w-full h-[320px] object-contain hover:scale-105 transition-all"
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
        <div className="w-full flex justify-center !mt-5" ref={ref}>{isFetchingNextPage && <Loader />}</div>
      </div>
    </div>


  );
};

export default MarketplacePage;
