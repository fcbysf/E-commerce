import { useState, useRef, useEffect } from 'react';
import { X, MoreHorizontal, Eye, Share2, Link, Pause, Pencil, Trash2, Rocket } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


export default function ListingModal({ isModalOpen, setIsModalOpen, listing }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const modalRef = useRef(null);
  const menuRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
        setIsMenuOpen(false);
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (

    isModalOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
        {/* Modal Content */}
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 m-0">Your listing</h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-2 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="flex gap-6">
              {/* Left Section - Product Info */}
              <div className="flex-1">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <img src={listing?.images[0].image} alt="product image" className="w-full h-full object-contain" />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 m-0">
                      {listing?.status=="sold"&& <small className='text-green-400 me-1'>Sold</small>}· {listing?.title}
                    </h3>
                    <p className="text-gray-600 text-sm m-0">MAD {listing?.price} · {listing?.city}</p>
                    <p className="text-gray-500 text-xs m-0">Posted {dayjs(listing?.created_at).fromNow()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 space-y-3">
                  {listing?.status === 'active' ?
                    <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                      <p className="text-sm m-0">✓</p>
                      <p className="font-medium m-0">Mark as sold</p>
                    </button>
                    :
                    <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                      <p className="text-sm m-0">✓</p>
                      <p className="font-medium m-0">Mark as Available</p>
                    </button>}
                </div>

                {/* Bottom Action Icons */}
                <div className="mt-6 flex items-center gap-4">
                  <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                      <Pause size={18} />
                    </div>
                    <span className="text-xs">Mark as pending</span>
                  </button>

                  <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                      <Pencil size={18} />
                    </div>
                    <span className="text-xs">Edit listing</span>
                  </button>

                  <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                      <Trash2 size={18} />
                    </div>
                    <span className="text-xs">Delete</span>
                  </button>

                  {/* More Options Button with Menu */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={toggleMenu}
                      className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                        <MoreHorizontal size={20} />
                      </div>
                      <span className="text-xs">More</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-64 z-10">

                        <button className="w-full px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-left text-gray-700">
                          <Eye size={18} className="text-gray-500" />
                          <div className="font-medium text-sm">View listing</div>
                        </button>

                        <button className="w-full px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-left text-gray-700">
                          <Share2 size={18} className="text-gray-500" />
                          <span className="font-medium text-sm">Share listing</span>
                        </button>


                        <button className="w-full px-4 py-3 hover:bg-gray-100 flex items-center gap-3 text-left text-gray-700">
                          <Link size={18} className="text-gray-500" />
                          <span className="font-medium text-sm">Copy link</span>
                        </button>

                      </div>
                    )}
                  </div>
                </div>

                {/* Listed Info */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Listed in 1 place</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                      <span className="text-xs">Marketplace</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Messages */}
              <div className="flex-1 border-l border-gray-200 pl-6">
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-4">
                  <div className="flex space-x-6">
                    <button className="text-blue-600 font-semibold pb-3 border-b-2 border-blue-600 text-sm">
                      Messages
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 m-0">Abduh Mortada</h4>
                    <p className="text-xs text-gray-500 m-0 mt-1">You: Marhbaaa</p>
                    <p className="text-xs text-gray-400 m-0">6 Jan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}