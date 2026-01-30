import { useContext, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Context } from "../../context/context";
import { createEcho } from '../../echo/echo';
import dayjs from 'dayjs';
import Conversation from './conversation';



export default function MarketplaceInbox() {
  const [activeTab, setActiveTab] = useState('selling');
  const [activeFilter, setActiveFilter] = useState('all');
  const [convId, setConvid] = useState(sessionStorage.getItem('convId') ?? null);
  const { api, token, user } = useContext(Context)


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
  const { data: conversationsFetch, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['conversations'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(api + 'conversation' + '?page=' + pageParam, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      if (!res.ok) throw 'Error fetching conversation'
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined
    }
  })
  const conversations = useMemo(() => conversationsFetch?.pages.flatMap(page => page.data) ?? [], [conversationsFetch])
  return (
    !convId &&
    <div className="w-full max-w-4xl mx-auto bg-white min-h-screen">
      {/* Tabs */}
      <div className="border-b border-gray-200 px-6 pt-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('selling')}
            className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'selling'
              ? 'text-blue-600 border-blue-600'
              : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
          >
            Selling
          </button>
          <button
            onClick={() => setActiveTab('buying')}
            className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'buying'
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === filter.toLowerCase()
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
        {conversations?.map((conv) => (
          <div
            key={conv.id}
            className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3 relative"
            onClick={() => { sessionStorage.setItem('convId', conv.id); setConvid(conv.id) }}
          >
            {/* Unread Indicator */}
            {conv.unread && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
            )}

            {/* Product Image */}
            <div className="w-14 h-14 flex-shrink-0 bg-gray-300 rounded-lg overflow-hidden">
              <img
                src={conv?.listing?.images[0]?.image}
                alt={conv?.listing?.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className={`text-sm ${conv.unread ? 'font-semibold' : 'font-normal'} text-gray-900 truncate m-0`}>
                  <span className='text-[16px] font-bold me-2'>{conv?.seller?.name == user?.name ? conv?.buyer?.name : conv?.seller?.name} ·</span>{conv?.listing?.title}
                </h3>
                <div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{dayjs(conv?.last_message?.created_at).fromNow()}</span><br />
                </div>
              </div>
              <p className={`text-sm font-bold truncate my-2 flex justify-between ${conv?.last_message?.seen_at && 'text-black/40'}`}>
                {conv?.last_message?.message || conv?.last_message?.sender_id !== user?.id && "reply ?"}
                {conv?.last_message.sender_id == user?.id && conv?.last_message?.seen_at && <small className='text-black/40 font-normal text-xs'>Seen {dayjs(conv?.last_message?.created_at).fromNow()}</small>}
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
    || <Conversation cnvId={convId} setconvoId={setConvid} />
  );
}