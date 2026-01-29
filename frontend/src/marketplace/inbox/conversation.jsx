import { useState, useRef, useEffect, useContext, useMemo } from 'react';
import {
    ArrowLeft,
    MoreHorizontal,
    Phone,
    Info,
    Image,
    Smile,
    Send,
    MapPin,
    DollarSign,
    Package,
    AlertCircle
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Context } from '../../context/context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createEcho } from '../../echo/echo';
dayjs.extend(relativeTime);

export default function Conversation({ cnvId, setconvoId }) {
    const [message, setMessage] = useState('');
    const { api, token, user } = useContext(Context);
    const messagesEndRef = useRef(null);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const echoRef = useRef(null);
    const queryClient = useQueryClient();


    // Initialize Echo once
    useEffect(() => {
        if (!token) return;
        echoRef.current = createEcho(token);
        return () => echoRef.current.disconnect();
    }, [token]);

    const { data: messages, isLoading, error } = useQuery({
        queryKey: ['messages', cnvId],
        queryFn: async () => {
            const res = await fetch(`${api}conversation/${cnvId}`, {
                headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw 'Error fetching messages';
            return res.json();
        },
    });


    // Subscribe to private channel
    useEffect(() => {
        if (!cnvId || !echoRef.current) return;

        const channel = echoRef.current.private(`chat.${cnvId}`);
        channel.listen('.MessageSent', (e) => {
            queryClient.setQueryData(['messages', cnvId], (old) => {
                if (e.message?.sender_id === user?.id) return;
                if ((old?.messages ?? []).some(m => m.id === e.message.id)) return old;
                return {
                    ...old,
                    messages: [...(old?.messages ?? []), e.message],
                };
            });
        });
        channel.listen('.MarkAsSeen', e => {
            queryClient.setQueryData(['messages', cnvId], old => {
                if (!old) return old;

                return {
                    ...old,
                    messages: old.messages.map(m =>
                        m.sender_id === user.id || m.seen_at
                            ? m
                            : { ...m, seen_at: e.seen_at }
                    ),
                };
            });
            queryClient.invalidateQueries(['messages', cnvId]);
        });

        return () => {
            channel.stopListening('.MessageSent');
            echoRef.current.leave(`chat.${cnvId}`);
            channel.stopListening('.MarkAsSeen');
            echoRef.current.leave(`chat.${cnvId}`);
        };
    }, [cnvId]);




    const handleSend = async () => {
        if (!message.trim()) return;

        const tempId = `temp-${Date.now()}`;
        const tempMessage = { id: tempId, message, sender_id: user.id, created_at: new Date().toISOString() };


        // Optimistic update
        queryClient.setQueryData(['messages', cnvId], (old) => ({
            ...old,
            messages: [...(old?.messages ?? []), tempMessage],
        }));
        setMessage('');
        scrollToBottom();

        // send to server
        await fetch(`${api}message`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ conversation_id: cnvId, message }),
        });

    };
    // Mark as seen 
    useEffect(() => {

        if (!messages || messages.messages.length === 0) return;
        const unseenMessages = messages.messages.filter(
            (m) => m.sender_id !== user?.id && !m.seen_at
        );
        if (unseenMessages.length === 0) return;

        fetch(`${api}markAsSeen`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                conversation_id: cnvId,
            }),
        });
    }, [messages, cnvId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickActions = [
        { icon: MapPin, text: 'Share location', color: 'text-blue-600' },
        { icon: DollarSign, text: 'Make offer', color: 'text-green-600' },
        { icon: Package, text: 'Mark as sold', color: 'text-purple-600' }
    ];

    return (
        <div className="flex flex-col h-screen bg-white w-full">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3 flex-1">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => { sessionStorage.removeItem('convId'); setconvoId(null) }}>
                        <ArrowLeft size={20} className="text-gray-700" />
                    </button>

                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden">
                        {messages?.listing?.images?.[0]?.image ? (
                            <img
                                src={messages.listing.images[0].image}
                                alt=""
                                className='w-10 h-10 rounded-full object-cover'
                            />
                        ) : (
                            <span>AM</span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate m-0">
                            {messages?.buyer?.name == user?.name ? messages?.seller?.name : messages?.buyer?.name}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Phone size={20} className="text-gray-700" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Info size={20} className="text-gray-700" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal size={20} className="text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Product Info Card */}
            {messages?.listing && (
                <div className="mx-4 mt-4 mb-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex gap-3">
                        <div className="w-20 h-20 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                            {messages.listing.images?.[0]?.image ? (
                                <img
                                    src={messages.listing.images[0].image}
                                    alt={messages.listing.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 m-0 mb-1">
                                {messages.listing.title}
                            </h4>
                            <p className="text-lg font-bold text-blue-600 m-0 mb-1">
                                {messages.listing.price} MAD
                            </p>
                            <p className="text-xs text-gray-500 m-0">
                                {messages.listing.city} · posted {dayjs(messages.listing.created_at).fromNow()}
                            </p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm h-fit">
                            View
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            {showQuickActions && (
                <div className="mx-4 mb-3 bg-blue-50 rounded-lg p-3 border border-blue-100 relative">
                    <button
                        onClick={() => setShowQuickActions(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                        ×
                    </button>
                    <p className="text-sm font-medium text-gray-700 mb-3 m-0">Quick actions</p>
                    <div className="flex gap-2 flex-wrap">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 bg-white rounded-full hover:bg-gray-50 transition-colors border border-gray-200 text-sm"
                            >
                                <action.icon size={16} className={action.color} />
                                <span className="text-gray-700">{action.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {/* System Message */}
                <div className="flex justify-center mb-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 flex items-start gap-2 max-w-md">
                        <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-800 m-0">
                            <strong>Safety tip:</strong> Meet in a public place and inspect items before making payment.
                        </p>
                    </div>
                </div>

                {messages?.messages?.map((msg, index) => {
                    const prevMsg = messages[index - 1];
                    const showDate = !prevMsg || dayjs(msg.created_at).format('YYYY-MM-DD') !== dayjs(prevMsg.created_at).format('YYYY-MM-DD');


                    return (
                        <div key={msg.id}>
                            {/* Date Separator */}{
                                dayjs(msg.created_at).format('YYYY-MM-DD') !== dayjs().format('YYYY-MM-DD') && showDate &&
                                <div className="flex justify-center my-4">
                                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        {dayjs(msg.created_at).diff(dayjs(), 'day') === 0
                                            ? 'Today'
                                            : dayjs(msg.created_at).diff(dayjs(), 'day') === -1
                                                ? 'Yesterday'
                                                : dayjs(msg.created_at).format('MMM D')
                                        }
                                    </span>
                                </div>}

                            {/* Message Bubble */}
                            <div className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'} mb-2`}>
                                <div className={`max-w-[70%] ${msg.sender_id === user?.id ? 'order-2' : 'order-1'}`}>
                                    <div
                                        className={`px-4 py-2 rounded-2xl ${msg.sender_id === user?.id
                                            ? 'bg-blue-600 text-white rounded-br-md'
                                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                                            } ${msg._optimistic ? 'opacity-70' : ''}`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap break-words m-0">
                                            {msg.message}
                                        </p>
                                    </div>
                                    <p className={`text-xs m-0 text-gray-500 mt-1 px-2 ${msg.sender_id === user?.id ? 'text-right' : 'text-left'
                                        }`}>
                                        {dayjs(msg.created_at).format('HH:mm')}
                                        <br />
                                        {index === messages.messages.length - 1 && msg.seen_at && msg.sender_id == user?.id && <small>Seen</small>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex items-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                        <Image size={22} className="text-blue-600" />
                    </button>

                    <div className="flex-1 bg-gray-100 rounded-3xl px-4 py-2 flex items-center gap-2">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent outline-none resize-none text-sm text-gray-900 placeholder-gray-500 max-h-32 disabled:opacity-50"
                            rows="1"
                            style={{
                                minHeight: '24px',
                                maxHeight: '128px',
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                        />
                        <button className="hover:opacity-70 transition-opacity flex-shrink-0">
                            <Smile size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className={`p-2 rounded-full transition-all flex-shrink-0 ${message.trim()
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Send size={20} />
                    </button>
                </div>

                <p className="text-xs text-gray-500 mt-2 text-center m-0 p-0">
                    Be respectful and keep the conversation about the listing
                </p>
            </div>
        </div>
    );
}