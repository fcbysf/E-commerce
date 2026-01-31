import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Context } from "../../context/context";
import dayjs from 'dayjs';
import Conversation from './conversation';
import { createEcho } from '../../echo/echo';



export default function MarketplaceInbox() {
  const [activeTab, setActiveTab] = useState('selling');
  const [activeFilter, setActiveFilter] = useState('all');
  const [convId, setConvid] = useState(sessionStorage.getItem('convId') ?? null);
  const { api, token, user } = useContext(Context)
  const queryClient = useQueryClient();
  const echoRef = useRef(null);
  useEffect(() => {
    if (!token) return;
    echoRef.current = createEcho(token);
    return () => echoRef.current.disconnect();
  }, [token]);
  // listen to new messages
useEffect(() => {
  if (!echoRef.current || !user) return;

  const channel = echoRef.current.private(`conversations.${user.id}`);

  channel.listen('.UpdateConversation', (e) => {
    console.log(e);
    queryClient.setQueryData(['conversations'], (old) => {
      if (!old) return old;

      const oldData = old.pages.flatMap(page => page.data);

      let newData = oldData.filter(
        c => c.id !== e.conversation.id
      );

      newData.push(e.conversation);

      newData.sort((a, b) =>
        new Date(b.last_message.created_at) -
        new Date(a.last_message.created_at)
      );

      return {
        ...old,
        pages: [{ ...old.pages[0], data: newData }]
      };
    });
  });

  return () => {
    channel.stopListening('.UpdateConversation');
    echoRef.current.leave(`conversations.${user.id}`);
  };
}, [user]);



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
              <p className={`text-sm font-bold truncate my-2 flex justify-between ${(conv?.last_message?.seen_at || conv?.last_message?.sender_id == user?.id) && 'text-black/40'}`}>
                {conv?.last_message?.message || (conv?.last_message?.file_type ==='audio') && <small className={`text-black/${conv?.last_message?.seen_at ? '40 font-normal' : '100 font-bold'}  text-sm flex items-center gap-1`}>voice message <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-microphone"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 9a1 1 0 0 1 1 1a8 8 0 0 1 -6.999 7.938l-.001 2.062h3a1 1 0 0 1 0 2h-8a1 1 0 0 1 0 -2h3v-2.062a8 8 0 0 1 -7 -7.938a1 1 0 1 1 2 0a6 6 0 0 0 12 0a1 1 0 0 1 1 -1m-7 -8a4 4 0 0 1 4 4v5a4 4 0 1 1 -8 0v-5a4 4 0 0 1 4 -4" /></svg></small>}
                {conv?.last_message?.message ||  conv?.last_message?.file_type ==='image' && <small className={`text-black/${conv?.last_message?.seen_at ? '40 font-normal' : '100 font-bold'}  text-sm flex items-center gap-1`}>image <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-polaroid"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" /><path d="M4 16l16 0" /><path d="M4 12l3 -3c.928 -.893 2.072 -.893 3 0l4 4" /><path d="M13 12l2 -2c.928 -.893 2.072 -.893 3 0l2 2" /><path d="M14 7l.01 0" /></svg></small>}
                {conv?.last_message?.sender_id == user?.id && conv?.last_message?.seen_at && <small className='text-black/40 font-normal text-xs'>Seen {dayjs(conv?.last_message?.created_at).fromNow()} </small>|| conv?.last_message?.sender_id == user?.id && !conv?.last_message?.seen_at&&<small className='text-black/40 font-normal text-xs'>Sent</small>}
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