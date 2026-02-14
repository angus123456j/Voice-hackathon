'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';

interface UploadSectionProps {
    onUploadComplete: (data: any) => void;
    isProcessing: boolean;
    setIsProcessing: (processing: boolean) => void;
}

export default function UploadSection({
    onUploadComplete,
    isProcessing,
    setIsProcessing,
}: UploadSectionProps) {
    const [mp3File, setMp3File] = useState<File | null>(null);
    const [slideFile, setSlideFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, type: 'audio' | 'slides') => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (type === 'audio') {
                if (file.type.includes('audio')) {
                    setMp3File(file);
                }
            } else {
                if (file.type.includes('pdf') || file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
                    setSlideFile(file);
                }
            }
        }
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'slides') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'audio') {
                setMp3File(e.target.files[0]);
            } else {
                setSlideFile(e.target.files[0]);
            }
        }
    }, []);

    const handleUpload = async () => {
        if (!mp3File || !slideFile) {
            alert('Please upload both audio and slides');
            return;
        }

        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append('audio', mp3File);
            formData.append('slides', slideFile);

            const response = await axios.post('/api/backend/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            onUploadComplete(response.data);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to process lecture. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="glass-strong rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Upload Lecture Materials
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* MP3 Upload */}
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive ? 'border-primary-500 bg-primary-500 bg-opacity-10' : 'border-dark-500'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, 'audio')}
                >
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Lecture Audio (MP3)</h3>
                    {mp3File ? (
                        <p className="text-green-400 mb-2">✓ {mp3File.name}</p>
                    ) : (
                        <p className="text-gray-400 mb-2">Drag and drop or click to upload</p>
                    )}
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleFileChange(e, 'audio')}
                        className="hidden"
                        id="audio-upload"
                    />
                    <label htmlFor="audio-upload" className="btn-secondary cursor-pointer inline-block">
                        Choose File
                    </label>
                </div>

                {/* Slides Upload */}
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive ? 'border-primary-500 bg-primary-500 bg-opacity-10' : 'border-dark-500'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, 'slides')}
                >
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Slide Deck (PDF/PPT)</h3>
                    {slideFile ? (
                        <p className="text-green-400 mb-2">✓ {slideFile.name}</p>
                    ) : (
                        <p className="text-gray-400 mb-2">Drag and drop or click to upload</p>
                    )}
                    <input
                        type="file"
                        accept=".pdf,.ppt,.pptx"
                        onChange={(e) => handleFileChange(e, 'slides')}
                        className="hidden"
                        id="slides-upload"
                    />
                    <label htmlFor="slides-upload" className="btn-secondary cursor-pointer inline-block">
                        Choose File
                    </label>
                </div>
            </div>

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={!mp3File || !slideFile || isProcessing}
                className="btn-premium w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? 'Processing...' : '🚀 Process Lecture'}
            </button>

            <p className="text-sm text-gray-400 mt-4 text-center">
                Maximum file size: 200MB for audio
            </p>
        </div>
    );
}
