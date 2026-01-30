import { useState, useEffect, useRef } from 'react';

export default function AudioMessage({ audioUrl, isSender, isOptimistic }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div
            className={`px-4 py-3 rounded-2xl flex items-center gap-3 min-w-[250px] ${
                isSender
                    ? 'bg-blue-600 rounded-br-md'
                    : 'bg-gray-100 rounded-bl-md'
            } ${isOptimistic ? 'opacity-70' : ''}`}
        >
            <audio ref={audioRef} src={audioUrl} preload="metadata" />
            
            {/* Play/Pause Button */}
            <button
                onClick={togglePlay}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isSender 
                        ? 'bg-white/20 hover:bg-white/30' 
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={isSender ? 'text-white' : 'text-white'}>
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={isSender ? 'text-white' : 'text-white'}>
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                )}
            </button>

            {/* Waveform and Progress */}
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-1 h-6">
                    {[...Array(25)].map((_, i) => {
                        const barProgress = (i / 25) * 100;
                        const isActive = barProgress <= progress;
                        const heights = [8, 12, 16, 12, 20, 16, 12, 18, 14, 10, 16, 12, 20, 14, 12, 18, 16, 12, 14, 10, 16, 12, 14, 18, 12];
                        
                        return (
                            <div
                                key={i}
                                className={`w-1 rounded-full transition-all ${
                                    isSender
                                        ? isActive ? 'bg-white' : 'bg-white/30'
                                        : isActive ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                                style={{ height: `${heights[i]}px` }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Duration */}
            <span className={`text-xs font-medium flex-shrink-0 ${isSender ? 'text-white/90' : 'text-gray-600'}`}>
                {formatTime(isPlaying ? currentTime : duration)}
            </span>
        </div>
    );
}