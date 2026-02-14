'use client';

import { useState, useEffect } from 'react';
import UploadSection from '@/components/UploadSection';
import SlideViewer from '@/components/SlideViewer';
import KnowledgeDocument from '@/components/KnowledgeDocument';
import AudioPlayer from '@/components/AudioPlayer';
import ChatInterface from '@/components/ChatInterface';
import { useWebSocket } from '@/hooks/useWebSocket';

interface LectureData {
    transcript?: string;
    knowledge?: any;
    slides?: string[];
    slideCount?: number;
}

export default function Home() {
    const [lectureData, setLectureData] = useState<LectureData>({});
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isTutorActive, setIsTutorActive] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const { sendMessage, isConnected } = useWebSocket((message) => {
        // Handle WebSocket messages
        if (message.type === 'navigate_slide') {
            setCurrentSlide(message.slideIndex);
        } else if (message.type === 'audio_stream') {
            setAudioUrl(message.audioUrl);
        } else if (message.type === 'tutor_response') {
            // Handle tutor response
            if (message.navigate_to_slide !== undefined) {
                setCurrentSlide(message.navigate_to_slide);
            }
        }
    });

    const handleUploadComplete = (data: LectureData) => {
        setLectureData(data);
        setIsProcessing(false);
    };

    const handleStartTutor = () => {
        setIsTutorActive(true);
        sendMessage({
            type: 'start_tutor',
            knowledge: lectureData.knowledge,
            slideCount: lectureData.slideCount,
        });
    };

    const handleAskQuestion = (question: string) => {
        sendMessage({
            type: 'question',
            question,
            currentSlide,
            knowledge: lectureData.knowledge,
        });
    };

    const handleInterrupt = () => {
        sendMessage({ type: 'interrupt' });
    };

    return (
        <main className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8 text-center relative">
                    {lectureData.knowledge && (
                        <button
                            onClick={() => {
                                setLectureData({});
                                setIsTutorActive(false);
                                setCurrentSlide(0);
                            }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <span>← Back to Upload</span>
                        </button>
                    )}
                    <h1 className="text-5xl font-bold mb-4 gradient-animate bg-clip-text text-transparent">
                        ProfReplay AI
                    </h1>
                    <p className="text-xl text-gray-300">
                        Transform lectures into interactive AI tutors
                    </p>
                </header>

                {/* Upload Section */}
                {!lectureData.knowledge && (
                    <div className="mb-8 animate-fade-in">
                        <UploadSection
                            onUploadComplete={handleUploadComplete}
                            isProcessing={isProcessing}
                            setIsProcessing={setIsProcessing}
                        />
                    </div>
                )}

                {/* Main Content */}
                {lectureData.knowledge && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
                        {/* Left Column - Slide Viewer */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-strong rounded-xl p-6">
                                <SlideViewer
                                    slides={lectureData.slides || []}
                                    currentSlide={currentSlide}
                                    onSlideChange={setCurrentSlide}
                                />
                            </div>

                            {/* Audio Player */}
                            <div className="glass-strong rounded-xl p-6">
                                <AudioPlayer
                                    audioUrl={audioUrl}
                                    onInterrupt={handleInterrupt}
                                    isActive={isTutorActive}
                                />
                            </div>

                            {/* Chat Interface */}
                            <div className="glass-strong rounded-xl p-6">
                                <ChatInterface
                                    onAskQuestion={handleAskQuestion}
                                    isConnected={isConnected}
                                    isTutorActive={isTutorActive}
                                />
                            </div>
                        </div>

                        {/* Right Column - Knowledge Document */}
                        <div className="lg:col-span-1">
                            <div className="glass-strong rounded-xl p-6 sticky top-6">
                                <div className="mb-4">
                                    {!isTutorActive ? (
                                        <button
                                            onClick={handleStartTutor}
                                            className="btn-premium w-full"
                                            disabled={!isConnected}
                                        >
                                            🎓 Start AI Tutor
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2 text-green-400">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="font-medium">Tutor Active</span>
                                        </div>
                                    )}
                                </div>

                                <KnowledgeDocument knowledge={lectureData.knowledge} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Processing Indicator */}
                {isProcessing && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="glass-strong rounded-xl p-8 text-center">
                            <div className="spinner mx-auto mb-4"></div>
                            <p className="text-xl font-medium">Processing your lecture...</p>
                            <p className="text-gray-400 mt-2">
                                Transcribing audio and structuring knowledge
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
