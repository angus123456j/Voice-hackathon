'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SlideViewerProps {
    slides: string[];
    currentSlide: number;
    onSlideChange: (index: number) => void;
}

export default function SlideViewer({
    slides,
    currentSlide,
    onSlideChange,
}: SlideViewerProps) {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [currentSlide]);

    const goToPrevSlide = () => {
        if (currentSlide > 0) {
            onSlideChange(currentSlide - 1);
        }
    };

    const goToNextSlide = () => {
        if (currentSlide < slides.length - 1) {
            onSlideChange(currentSlide + 1);
        }
    };

    if (!slides || slides.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No slides available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Lecture Slides</h2>
                <span className="text-sm text-gray-400">
                    Slide {currentSlide + 1} of {slides.length}
                </span>
            </div>

            {/* Slide Display */}
            <div className="relative bg-dark-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                {imageError ? (
                    <div className="text-center">
                        <p className="text-gray-400">Failed to load slide</p>
                    </div>
                ) : (
                    <img
                        src={slides[currentSlide]}
                        alt={`Slide ${currentSlide + 1}`}
                        className="max-w-full max-h-full object-contain"
                        onError={() => setImageError(true)}
                    />
                )}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
                <button
                    onClick={goToPrevSlide}
                    disabled={currentSlide === 0}
                    className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    ← Previous
                </button>

                {/* Slide Thumbnails / Quick Nav */}
                <div className="flex space-x-2 overflow-x-auto max-w-md">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => onSlideChange(index)}
                            className={`px-3 py-1 rounded text-sm transition-all ${index === currentSlide
                                ? 'bg-primary-500 text-white'
                                : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={goToNextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
