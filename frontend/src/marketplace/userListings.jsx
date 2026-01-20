import { useContext, useState } from 'react';
import { User, Plus, HelpCircle, Search, Share2, MoreHorizontal, TrendingUp, RotateCcw, CheckCircle, Edit, Edit2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Context } from '../context/context';
import { useNavigate } from 'react-router-dom';


export default function MarketplaceListings() {
    const navigate = useNavigate();
    const { api, token, user } = useContext(Context)
    const { data: listings } = useQuery({
        queryKey: ['userListings'],
        queryFn: async () => {
            const res = await fetch(api + 'userlistings', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            if (!res.ok) {
                throw 'Something went wrong'
            }
            return res.json()
        },
        staleTime: 30000
    })

    return (
        <div className="flex  bg-gray-50">
            {/* Center - Your Listings */}
            <div className="flex-1 px-2 py-1">
                {/* Header */}
                <div className="flex items-center justify-between mb-3 bg-white p-3 rounded-lg">
                    <h1 className="text-2xl font-bold text-gray-900 m-0">Your listings</h1>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative w-72">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search your listings"
                                className="w-3/4 py-2 pl-9 pr-3 border-0 rounded-full bg-gray-100 text-sm outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Listings */}
                <div className="flex flex-col gap-3">
                    {listings?.length === 0 && <div className='w-full h-full flex items-center justify-center mt-3'>You have no listings yet.</div>
                        ||
                        listings?.map((listing, index) => (
                            <div
                                key={listing.id}
                                className="bg-white rounded-lg p-4 shadow-sm animate-slideIn"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Tip Banner */}
                                {listing.showTip && (
                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-md mb-3 text-xs text-blue-600">
                                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                            i
                                        </div>
                                        <span className="font-semibold">Tip: Improve the description</span>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    {/* Image */}
                                    <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                        <img
                                            src={listing.images[0].image}
                                            alt={listing.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="text-base font-semibold text-gray-900 m-0 mb-1">
                                            {listing.title}
                                        </h3>

                                        <div className="text-xl font-semibold text-gray-900 m-0 mb-2">
                                            MAD {listing.price}
                                        </div>

                                        <div className={`text-xs text-gray-500 mb-1 ${listing.status === 'sold' ? 'text-green-500' : ''}`}>
                                            {listing.status} · Listed on {new Date(listing.created_at).toLocaleDateString()}
                                        </div>

                                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                            <span>Listed on Marketplace ·</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 mt-auto">
                                            {listing.status === 'active' ? (
                                                <>
                                                    <button className="py-2 px-4 bg-[#56acd115] border border-gray-300 rounded-md text-sm font-semibold cursor-pointer flex items-center gap-1.5 transition-colors hover:bg-gray-100 text-[#1d546c]">
                                                        <CheckCircle size={16} />
                                                        Mark as sold
                                                    </button>
                                                    <button className="py-2 px-4 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-900 cursor-pointer flex items-center gap-1.5 transition-colors hover:bg-gray-100" onClick={() => navigate(`/marketplace/product/${listing.id}`)}>
                                                        <TrendingUp size={16} />
                                                        View Listing
                                                    </button>
                                                    <button className="py-2 px-4 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-900 cursor-pointer flex items-center gap-1.5 transition-colors hover:bg-gray-100">
                                                        <Edit2 size={16} />
                                                        Edit
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="py-2 px-4 bg-[#56acd115] border border-gray-300 rounded-md text-sm font-semibold text-[#1d546c] cursor-pointer flex items-center gap-1.5 transition-colors hover:bg-gray-100">
                                                        <CheckCircle size={16} />
                                                        Mark as available
                                                    </button>
                                                    <button className="py-2 px-4 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-900 cursor-pointer flex items-center gap-1.5 transition-colors hover:bg-gray-100">
                                                        <RotateCcw size={16} />
                                                        Relist This Item
                                                    </button>
                                                    <button className="py-2 px-4 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-900 cursor-pointer flex items-center gap-1.5 transition-colors hover:bg-gray-100">
                                                        <Edit size={16} />
                                                        Edit Listing
                                                    </button>
                                                </>
                                            )}
                                            <button className="py-2 px-3 bg-white border border-gray-300 rounded-md cursor-pointer flex items-center transition-colors hover:bg-gray-100">
                                                <MoreHorizontal size={16} className="text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Right Sidebar - Marketplace Profile */}
            <div className="w-[360px] h-screen bg-white border-l mt-1 border-gray-200 sticky top-0">
                {/* Header */}
                <div className="p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 m-0 mb-4">
                        Marketplace profile
                    </h2>

                    {/* Profile Card */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                            {user?.image &&
                                <img src={user?.image || "/defaultprf.png"} alt="user image" className="w-full h-full object-cover rounded-full" />
                                || <User size={32} className="text-gray-500" />
                            }
                        </div>
                        <div>
                            <div className="text-base font-semibold text-gray-900 mb-0.5">
                                {user?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {listings?.filter((listing) => listing.status === 'active').length} Active Listings
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <button className="w-full py-2.5 px-3 bg-white border-0 rounded-md text-sm font-semibold text-blue-600 cursor-pointer mb-2 flex items-center justify-center gap-2 transition-colors hover:bg-gray-100" onClick={() => navigate('/marketplace/addListing')}>
                        <Plus size={20} />
                        Create new listing
                    </button>

                    <button className="w-full py-2.5 px-3 bg-blue-50 border-0 rounded-md text-sm font-medium text-blue-600 cursor-pointer transition-colors hover:bg-blue-100">
                        See Marketplace profile
                    </button>
                </div>

                {/* Need Help Section */}
                <div className="p-5 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 m-0 mb-3">
                        Need help?
                    </h3>

                    <button className="w-full py-2 px-3 bg-white border-0 rounded-md text-sm font-normal text-gray-900 cursor-pointer flex items-center gap-2 text-left transition-colors hover:bg-gray-100">
                        <HelpCircle size={20} className="text-gray-500" />
                        See All Help Topics
                    </button>
                </div>
            </div>
        </div>
    );
}