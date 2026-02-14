'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
    audioUrl: string | null;
    onInterrupt: () => void;
    isActive: boolean;
}

export default function AudioPlayer({
    audioUrl,
    onInterrupt,
    isActive,
}: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioUrl && audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [audioUrl]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleInterrupt = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
        onInterrupt();
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRate = parseFloat(e.target.value);
        setPlaybackRate(newRate);
        if (audioRef.current) {
            audioRef.current.playbackRate = newRate;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">AI Tutor Voice</h2>
                {isActive && isPlaying && (
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                            <div className="w-1 h-4 bg-primary-500 rounded animate-pulse"></div>
                            <div className="w-1 h-6 bg-primary-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-5 bg-primary-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-primary-400">Speaking...</span>
                    </div>
                )}
            </div>

            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Controls */}
            <div className="flex items-center space-x-4">
                {/* Play/Pause */}
                <button
                    onClick={togglePlayPause}
                    disabled={!audioUrl}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                </button>

                {/* Interrupt Button */}
                <button
                    onClick={handleInterrupt}
                    disabled={!isActive || !isPlaying}
                    className="btn-premium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ✋ Interrupt & Ask
                </button>

                {/* Playback Speed */}
                <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-400">Speed:</label>
                    <select
                        value={playbackRate}
                        onChange={handlePlaybackRateChange}
                        className="bg-dark-700 border border-dark-500 rounded px-2 py-1 text-sm"
                    >
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1.0">1.0x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2.0">2.0x</option>
                    </select>
                </div>

                {/* Volume */}
                <div className="flex items-center space-x-2 flex-1">
                    <label className="text-sm text-gray-400">🔊</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="flex-1 accent-primary-500"
                    />
                    <span className="text-sm text-gray-400 w-12">
                        {Math.round(volume * 100)}%
                    </span>
                </div>
            </div>

            {!isActive && (
                <p className="text-sm text-gray-400 text-center">
                    Start the AI tutor to hear professor-voiced explanations
                </p>
            )}
        </div>
    );
}
