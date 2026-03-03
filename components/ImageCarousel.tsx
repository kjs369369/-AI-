import React, { useRef, useState, useEffect } from 'react';
import type { GeneratedImage } from '../types';

interface ImageCarouselProps {
  images: GeneratedImage[];
  onImageClick: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onImageClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const child = scrollRef.current.children[index] as HTMLElement;
      if (child) {
        child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const childWidth = container.children[0]?.clientWidth || 1;
      const gap = 16;
      const index = Math.round(scrollLeft / (childWidth + gap));
      setActiveIndex(Math.min(index, images.length - 1));
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [images.length]);

  const handleDownload = (e: React.MouseEvent, image: GeneratedImage, index: number) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `nanobanana-${index + 1}-${image.angleName.replace(/\s/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      {/* Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        {activeIndex > 0 && (
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-apple-card-dark/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition hover:scale-110"
            aria-label="이전"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-apple-text dark:text-apple-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {/* Right Arrow */}
        {activeIndex < images.length - 1 && (
          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-apple-card-dark/80 backdrop-blur-sm shadow-lg flex items-center justify-center transition hover:scale-110"
            aria-label="다음"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-apple-text dark:text-apple-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 scrollbar-hide"
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="flex-none w-72 sm:w-80 snap-center cursor-pointer group"
              onClick={() => onImageClick(index)}
            >
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-apple-card-dark shadow-sm hover:shadow-lg transition-shadow">
                <img src={image.src} alt={image.angleName} className="w-full aspect-square object-cover" />
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium text-apple-text dark:text-apple-text-dark">{image.angleName}</span>
                  <button
                    onClick={(e) => handleDownload(e, image, index)}
                    className="text-apple-blue dark:text-apple-blue-dark hover:opacity-70 transition"
                    aria-label={`${image.angleName} 다운로드`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`rounded-full transition-all ${
              index === activeIndex
                ? 'w-6 h-2 bg-apple-blue dark:bg-apple-blue-dark'
                : 'w-2 h-2 bg-black/20 dark:bg-white/20'
            }`}
            aria-label={`이미지 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
