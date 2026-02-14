'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatInterfaceProps {
    onAskQuestion: (question: string) => void;
    isConnected: boolean;
    isTutorActive: boolean;
}

export default function ChatInterface({
    onAskQuestion,
    isConnected,
    isTutorActive,
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim() || !isTutorActive) return;

        const userMessage: Message = {
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        onAskQuestion(inputValue);
        setInputValue('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleVoiceInput = async () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice input not supported in this browser');
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
            setIsRecording(false);
        };

        recognition.onerror = () => {
            setIsRecording(false);
            alert('Voice recognition error. Please try again.');
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
    };

    // Listen for tutor responses via props or context
    useEffect(() => {
        // This would be connected to WebSocket messages in production
        // For now, it's a placeholder
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Ask Questions</h2>

            {/* Messages */}
            <div className="bg-dark-800 rounded-lg p-4 h-64 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        {isTutorActive
                            ? 'Ask a question to get started!'
                            : 'Start the tutor to begin asking questions'}
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-dark-700 text-gray-200'
                                    }`}
                            >
                                <p className="text-sm">{message.content}</p>
                                <span className="text-xs opacity-70 mt-1 block">
                                    {message.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex space-x-2">
                <div className="flex-1 relative">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={
                            isTutorActive
                                ? 'Type your question...'
                                : 'Start the tutor first...'
                        }
                        disabled={!isTutorActive}
                        className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 resize-none focus:outline-none focus:border-primary-500 disabled:opacity-50"
                        rows={2}
                    />
                </div>

                {/* Voice Input Button */}
                <button
                    onClick={handleVoiceInput}
                    disabled={!isTutorActive || isRecording}
                    className={`btn-secondary px-4 ${isRecording ? 'bg-red-600' : ''}`}
                    title="Voice input"
                >
                    {isRecording ? '⏺️' : '🎤'}
                </button>

                {/* Send Button */}
                <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || !isTutorActive}
                    className="btn-premium px-6"
                >
                    Send
                </button>
            </div>

            {/* Connection Status */}
            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                    {isConnected ? (
                        <span className="flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Connected
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                            Disconnected
                        </span>
                    )}
                </span>
                {isTutorActive && (
                    <span className="text-primary-400">Tutor is listening</span>
                )}
            </div>
        </div>
    );
}
