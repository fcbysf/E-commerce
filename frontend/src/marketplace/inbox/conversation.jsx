import { useState, useRef, useEffect, useContext } from 'react';
import {
    ArrowLeft,
    MoreHorizontal,
    Phone,
    Info,
    Image,
    Send,
    AlertCircle,
    X,
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Context } from '../../context/context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createEcho } from '../../echo/echo';
import AudioMessage from './AudioCom';
import calendar from 'dayjs/plugin/calendar';
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
dayjs.extend(calendar);
dayjs.extend(relativeTime);


export default function Conversation({ cnvId, setconvoId }) {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const { api, token, user } = useContext(Context);
    const messagesEndRef = useRef(null);
    const queryClient = useQueryClient();
    const echoRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [audio, setAudio] = useState({ file: null, url: null });
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);


    // Initialize Echo 
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
        // Listen for new messages
        const channel = echoRef.current.private(`chat.${cnvId}`);
        channel.listen('.MessageSent', (e) => {
            queryClient.setQueryData(['messages', cnvId], (old) => {
                const filteredMessages = (old?.messages ?? []).filter(m => {
                    if (!m.id?.toString().startsWith('temp-')) return true;
                    return !m._optimistic
                });
                if (filteredMessages.some(m => m.id === e.message.id)) return old;
                return {
                    ...old,
                    messages: [...filteredMessages, e.message],
                };
            });
        });

        // Listen for seen messages
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



    // Send Message
    const handleSend = async () => {
        if (!message.trim()) return;
        const tempId = `temp-${Date.now()}`;
        const tempMessage = { id: tempId, message, sender_id: user.id, created_at: new Date().toISOString(), _optimistic: true };
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

    // Audio Recording Functions
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            recorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const file = new File([blob], `audio-${Date.now()}.webm`, { type: 'audio/webm' });
                setAudio({ file, url });

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please check your permissions.');
        }
    };

    const stopRecording = () => {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
            recorderRef.current.stop();
            setRecording(false);
        }
    };

    const cancelAudio = () => {
        if (audio.url) {
            URL.revokeObjectURL(audio.url);
        }
        setRecording(false);
        setAudio({ file: null, url: null });
    };

    const sendAudio = async () => {
        if (!audio.file) return;

        // Create optimistic audio message with sending state
        const tempId = `temp-${Date.now()}`;
        const tempAudioMessage = {
            id: tempId,
            file_path: audio.url, // Use local URL for immediate playback
            file_type: 'audio',
            sender_id: user.id,
            created_at: new Date().toISOString(),
            _optimistic: true,
            _sending: true // Flag to indicate sending state
        };

        // Add optimistic message to UI
        queryClient.setQueryData(['messages', cnvId], (old) => ({
            ...old,
            messages: [...(old?.messages ?? []), tempAudioMessage],
        }));

        // Clear audio preview
        const audioToSend = { ...audio };
        cancelAudio();
        scrollToBottom();

        const formData = new FormData();
        formData.append('file_path', audioToSend.file);
        formData.append('conversation_id', cnvId);
        formData.append('file_type', 'audio');

        try {
            const res = await fetch(`${api}message`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();

                // Update message to "sent" state (waiting for WebSocket)
                queryClient.setQueryData(['messages', cnvId], (old) => ({
                    ...old,
                    messages: (old?.messages ?? []).map(m =>
                        m.id === tempId ? {
                            ...m,
                            _sending: false,
                            _sent: true,
                            serverTempId: data.message?.id // Store server ID for WebSocket matching
                        } : m
                    ),
                }));

                // Clean up the blob URL after a delay (WebSocket should arrive soon)
                setTimeout(() => {
                    URL.revokeObjectURL(audioToSend.url);
                }, 5000);
            }
        } catch (err) {
            console.error('Error sending audio:', err);

            // Mark as failed
            queryClient.setQueryData(['messages', cnvId], (old) => ({
                ...old,
                messages: (old?.messages ?? []).map(m =>
                    m.id === tempId ? { ...m, _sending: false, _failed: true } : m
                ),
            }));
        }
    };

    // Cleanup audio URL on unmount
    useEffect(() => {
        return () => {
            if (audio.url) {
                URL.revokeObjectURL(audio.url);
            }
        };
    }, [audio.url]);

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
        setTimeout(() => {
            scrollToBottom();
        }, 10)
    }, [messages]);


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const sendImages = async () => {
        if (!image) return;
        const formData = new FormData();
        formData.append('conversation_id', cnvId);
        formData.append('file_type', 'image');
        formData.append('file_path', image);

        const optimisticImage = {
            id: `temp-${Date.now()}`,
            file_path: URL.createObjectURL(image),
            file_type: 'image',
            sender_id: user?.id,
            created_at: new Date().toISOString(),
            _optimistic: true,
            _sending: true,
        };
        queryClient.setQueryData(['messages', cnvId], (old) => ({
            ...old,
            messages: [...(old?.messages ?? []), optimisticImage],
        }));
        setImage(null);


        try {
            const res = await fetch(`${api}message`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();

                // Update message to "sent" state (waiting for WebSocket)
                queryClient.setQueryData(['messages', cnvId], (old) => ({
                    ...old,
                    messages: (old?.messages ?? []).map(m =>
                        m.id === tempId ? {
                            ...m,
                            _sending: false,
                            _sent: true,
                            serverTempId: data.message?.id // Store server ID for WebSocket matching
                        } : m
                    ),

                }));


                // Clean up the blob URL after a delay (WebSocket should arrive soon)
                setTimeout(() => {
                    URL.revokeObjectURL(image);
                }, 6000);

            }
        } catch (err) {
            console.error('Error sending audio:', err);

            // Mark as failed
            queryClient.setQueryData(['messages', cnvId], (old) => ({
                ...old,
                messages: (old?.messages ?? []).map(m =>
                    m.id === tempId ? { ...m, _sending: false, _failed: true } : m
                ),
            }));
        }

    }



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
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm h-fit" onClick={() => navigate(`/marketplace/product/${messages.listing.id}`)}>
                            View
                        </button>
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
                    const prevMsg = messages.messages[index - 1];
                    const showTime = !prevMsg || dayjs(msg.created_at).diff(dayjs(prevMsg.created_at), 'minute') >= 10;
                    const showDate =
                        !prevMsg ||
                        !dayjs(msg.created_at).isSame(prevMsg.created_at, 'day');

                    return (
                        <div key={msg.id}>
                            {/* Date Separator */}{
                                dayjs(msg.created_at).format('YYYY-MM-DD') !== dayjs().format('YYYY-MM-DD') && showDate &&
                                <div className="flex justify-center my-4">
                                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        {dayjs(msg.created_at).calendar(null, {
                                            sameDay: 'Today',
                                            lastDay: 'Yesterday',
                                            lastWeek: 'MMM D',
                                            sameElse: 'MMM D',
                                        })}
                                    </span>
                                </div>}

                            {/* Message Bubble */}
                            <div className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[55%] ${msg.sender_id === user?.id ? 'order-2' : 'order-1'}`}>
                                    {/* Text Message*/}
                                    {msg.message && !msg.file_path &&
                                        <>

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
                                            {showTime && <p className={`text-xs m-0 text-gray-500 px-2 ${msg.sender_id === user?.id ? 'text-right' : 'text-left'
                                                }`}>
                                                {dayjs(msg.created_at).format('HH:mm')}
                                                <br />
                                            </p>}
                                            {index === messages.messages.length - 1 && msg.seen_at && msg.sender_id == user?.id && <p className='text-xs m-0 text-gray-500 text-right me-2'>Seen</p>}
                                        </>
                                    }
                                    {/* Audio Message */}
                                    {msg.file_path &&
                                        <>
                                            {msg.file_type === 'audio' && <div className="relative">
                                                <AudioMessage
                                                    audioUrl={msg.file_path}
                                                    isSender={msg.sender_id === user?.id}
                                                    isOptimistic={msg._optimistic}
                                                />
                                                {/* Sending/Sent/Failed Status Indicator */}
                                                {msg._sending && (
                                                    <div className="absolute -bottom-1 -right-1 flex items-center gap-1">
                                                        <div className="w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                                                            <svg className="animate-spin w-3 h-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                                {(msg._sent) && (
                                                    <div className="absolute -bottom-1 -right-1">
                                                        <div className="w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                                {msg._failed && (
                                                    <div className="absolute -bottom-1 -right-1">
                                                        <div className="w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>}
                                            {
                                                msg.file_type === 'image' &&
                                                <div className="relative">
                                                    <img src={msg.file_path} alt="" className={`w-56 object-contain ${msg._optimistic ? 'opacity-70' : ''} rounded-md`} />
                                                    {/* Sending/Sent/Failed Status Indicator */}
                                                    {msg._sending && (
                                                        <div className="absolute -bottom-1 -right-1 flex items-center gap-1">
                                                            <div className="w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                                                                <svg className="animate-spin w-3 h-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(msg._sent) && (
                                                        <div className="absolute -bottom-1 -right-1">
                                                            <div className="w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                                                                <svg className="w-3 h-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {msg._failed && (
                                                        <div className="absolute -bottom-1 -right-1">
                                                            <div className="w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                                                                <svg className="w-3 h-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                            {(msg._sent || showTime) && <p className={`text-xs m-0 text-gray-500 mt-1 px-2 ${msg.sender_id === user?.id ? 'text-right' : 'text-left'
                                                }`}>
                                                {dayjs(msg.created_at).format('HH:mm')}
                                                {msg._sending && <span className="ml-1 text-gray-400">• Sending...</span>}
                                                {msg._sent && <span className="ml-1 text-gray-400">• Sent</span>}
                                                {msg._failed && <span className="ml-1 text-red-500">• Failed</span>}
                                                <br />
                                            </p>}
                                            {index === messages.messages.length - 1 && msg.seen_at && msg.sender_id == user?.id && <p className='text-xs m-0 text-gray-500 text-right me-2 mt-1 '>Seen</p>}
                                        </>
                                    }
                                </div>
                            </div>

                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Audio Preview Section */}
            {
                audio.url && (
                    <div className="w-3/4 m-auto border-t border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={cancelAudio}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                                title="Delete"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>

                            <div className="flex-1 bg-gray-100 rounded-3xl px-4 py-2 flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-full flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M19 9a1 1 0 0 1 1 1a8 8 0 0 1 -6.999 7.938l-.001 2.062h3a1 1 0 0 1 0 2h-8a1 1 0 0 1 0 -2h3v-2.062a8 8 0 0 1 -7 -7.938a1 1 0 1 1 2 0a6 6 0 0 0 12 0a1 1 0 0 1 1 -1m-7 -8a4 4 0 0 1 4 4v5a4 4 0 1 1 -8 0v-5a4 4 0 0 1 4 -4" />
                                    </svg>

                                </div>

                                <audio
                                    controls
                                    src={audio.url}
                                    className="flex-1"
                                    style={{ height: '32px', outline: 'none' }}
                                />
                            </div>

                            <button
                                onClick={sendAudio}
                                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors flex-shrink-0"
                                title="Send"
                            >
                                <Send size={20} className="text-white" />
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Message Input */}
            {
                !audio.url && (
                    <div className="w-3/4 m-auto border-t border-gray-200 p-4 bg-white">
                        <div className="flex items-end gap-2">
                            {!recording && <label htmlFor='image' className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                                <Image size={22} className="text-blue-600" />
                            </label>}
                            <input type="file" className='hidden' name="" id="image" onChange={(e) => { setImage(e.target.files[0]) }} />

                            {!recording ? (
                                <div className='w-full'>
                                    {image &&
                                        <div className="flex flex-wrap justify-center items-center gap-3 flex-1 mb-1.5">
                                            <div className="img w-36 h-36 bg-gray-100 rounded flex-shrink-0 overflow-hidden relative">
                                                <X size={17} className='absolute right-0 top-0 text-black/70 cursor-pointer hover:text-red-300' onClick={() => setImage(null)} />
                                                <img src={image && URL.createObjectURL(image)} alt="" className='w-36 rounded object-contain' />
                                            </div>
                                        </div>
                                    }
                                    {!image && <div className="flex-1 bg-gray-100 rounded-3xl px-4 py-2 flex items-center gap-2">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-transparent outline-none resize-none text-sm text-gray-900 placeholder-gray-500 max-h-32"
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

                                    </div>}
                                </div>
                            ) : (
                                <div className="flex-1 bg-red-50 border-2 border-red-500 rounded-3xl px-4 py-3 flex items-center gap-3">

                                    <div className="flex items-center gap-2 flex-1">
                                        <X size={20} onClick={cancelAudio} className='cursor-pointer hover:text-red-500' />
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-red-700">Recording...</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 bg-red-500 rounded-full animate-pulse"
                                                style={{
                                                    height: `${Math.random() * 20 + 10}px`,
                                                    maxHeight: '23px',
                                                    animationDelay: `${i * 0.1}s`
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                {!recording ? (
                                    <>

                                        {!image && <button
                                            onClick={startRecording}
                                            className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="fill-blue-500 hover:fill-blue-700 transition-all cursor-pointer">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M19 9a1 1 0 0 1 1 1a8 8 0 0 1 -6.999 7.938l-.001 2.062h3a1 1 0 0 1 0 2h-8a1 1 0 0 1 0 -2h3v-2.062a8 8 0 0 1 -7 -7.938a1 1 0 1 1 2 0a6 6 0 0 0 12 0a1 1 0 0 1 1 -1m-7 -8a4 4 0 0 1 4 4v5a4 4 0 1 1 -8 0v-5a4 4 0 0 1 4 -4" />
                                            </svg>
                                        </button>}
                                        <button
                                            onClick={!image ? handleSend : sendImages}
                                            disabled={!message.trim() && !image}
                                            className={`p-2 rounded-full transition-all flex-shrink-0 ${(message.trim() || image)
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <Send size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={stopRecording}
                                            className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="fill-white">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2 text-center m-0 p-0">
                            Be respectful and keep the conversation about the listing
                        </p>
                    </div>
                )
            }
        </div >
    );
}