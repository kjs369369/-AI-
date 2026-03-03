import React from 'react';
import type { GeneratedImage } from '../types';

interface ImageGridProps {
  images: GeneratedImage[];
  onImageClick: (index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageClick }) => {
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
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="cursor-pointer group animate-fadeIn"
          onClick={() => onImageClick(index)}
        >
          <div className="rounded-2xl overflow-hidden bg-white dark:bg-apple-card-dark shadow-sm hover:shadow-lg transition-all hover:scale-[1.02]">
            <img
              src={image.src}
              alt={image.angleName}
              className="w-full aspect-square object-cover"
            />
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-apple-text dark:text-apple-text-dark truncate">
                {image.angleName}
              </span>
              <button
                onClick={(e) => handleDownload(e, image, index)}
                className="text-apple-blue dark:text-apple-blue-dark hover:opacity-70 transition flex-shrink-0 ml-1"
                aria-label={`${image.angleName} 다운로드`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
