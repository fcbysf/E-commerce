import { useContext, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Context } from "../../context/context";



export default function MarketplaceInbox() {
  const [activeTab, setActiveTab] = useState('selling');
  const [activeFilter, setActiveFilter] = useState('all');
  const {api , token} = useContext(Context)

  const filters = [
    'All',
    'Pending payment',
    'Paid',
    'To be dispatched',
    'Dispatched',
    'Cash on delivery',
    'Completed'
  ];

  // fetch conversations
  const {data: conversationsFetch, error, isLoading,fetchNextPage,hasNextPage,isFetchingNextPage}= useInfiniteQuery({
    queryKey: ['conversations'],
    queryFn: async ({pageParam = 1 }) =>{
        const res = await fetch(api + 'conversation',{
            headers:{
                Accept : 'application/json',
                Authorization : `Bearer ${token}`,
            }
        });
        if(!res.ok)throw 'Error fetching conversation'
        return res.json();
    },
    getNextPageParam : (lastPage) =>{
        lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined
    } 
  })
  const conversations = useMemo(()=>conversationsFetch?.pages.flatMap(page=>page.data)??[],[conversationsFetch])
  console.log(conversations);

  const messages = [
    {
      id: 1,
      image: '/api/placeholder/60/60',
      title: 'Str Luxu · 70 سروال ملبح غريب dh',
      message: '😊 هل لا يزال هذا العنصر متوفرًا؟',
      date: '14 Jan',
      unread: false
    },
    {
      id: 2,
      image: '/api/placeholder/60/60',
      title: 'Mohamed · Gilet original',
      message: 'Kayn xxl',
      date: '12 Jan',
      unread: false
    },
    {
      id: 3,
      image: '/api/placeholder/60/60',
      title: 'Gilet original · مصطفى',
      message: 'مصطفى السلام sent you a message about your listing: Gilet original.',
      date: '12 Jan',
      unread: true
    },
    {
      id: 4,
      image: '/api/placeholder/60/60',
      title: 'Zakaria · Gilet original',
      message: 'Fin kin',
      date: '11 Jan',
      unread: true
    },
    {
      id: 5,
      image: '/api/placeholder/60/60',
      title: 'Mohammed · Gilet original',
      message: 'Taman',
      date: '11 Jan',
      unread: true
    },
    {
      id: 6,
      image: '/api/placeholder/60/60',
      title: 'Salah · Gilet original',
      message: 'تمن',
      date: '11 Jan',
      unread: true
    },
    {
      id: 7,
      image: '/api/placeholder/60/60',
      title: 'Anouar · Gilet original',
      message: 'Salam',
      date: '11 Jan',
      unread: true
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white min-h-screen">
      {/* Tabs */}
      <div className="border-b border-gray-200 px-6 pt-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('selling')}
            className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'selling'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            Selling
          </button>
          <button
            onClick={() => setActiveTab('buying')}
            className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'buying'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            Buying
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-6 py-4 border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Filter by label</p>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-gray-200">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3 relative"
          >
            {/* Unread Indicator */}
            {msg.unread && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
            )}

            {/* Product Image */}
            <div className="w-14 h-14 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={msg.image}
                alt={msg.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className={`text-sm ${msg.unread ? 'font-semibold' : 'font-normal'} text-gray-900 truncate m-0`}>
                  {msg.title}
                </h3>
                <span className="text-xs text-gray-500 flex-shrink-0">{msg.date}</span>
              </div>
              <p className={`text-sm ${msg.unread ? 'font-medium' : 'font-normal'} text-gray-600 truncate my-2`}>
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
    </div>
  );
}