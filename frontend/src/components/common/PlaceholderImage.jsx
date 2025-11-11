import { useState } from 'react';

const PlaceholderImage = ({ 
  src,
  alt,
  size = 40, 
  text = "C", 
  className = "",
  fallbackIcon = null,
  aspectRatio = "square" // square, video, photo
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    32: "h-8 w-8 text-sm",
    40: "h-10 w-10 text-base",
    48: "h-12 w-12 text-lg",
    64: "h-16 w-16 text-xl",
    80: "h-20 w-20 text-2xl",
    96: "h-24 w-24 text-3xl"
  };

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    photo: "aspect-[4/3]"
  };

  // Always maintain consistent container dimensions
  const containerClasses = `relative ${sizeClasses[size] || sizeClasses[40]} ${className} flex-shrink-0`;
  const contentClasses = "rounded-lg flex items-center justify-center w-full h-full";

  // If we have a src and no error, try to show the image
  if (src && !imageError) {
    return (
      <div className={containerClasses}>
        {/* Loading skeleton - always present until image loads */}
        <div className={`${contentClasses} bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`}>
          <div className="h-full w-full rounded-lg bg-gray-300"></div>
        </div>
        
        {/* Actual image - positioned absolutely to prevent layout shift */}
        <img
          src={src}
          alt={alt}
          className={`${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 rounded-lg object-cover w-full h-full absolute inset-0`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Show fallback with consistent dimensions
  return (
    <div className={containerClasses}>
      <div className={`${contentClasses} bg-indigo-600`}>
        {fallbackIcon ? (
          <div className="text-white">
            {fallbackIcon}
          </div>
        ) : (
          <span className="text-white font-bold">{text}</span>
        )}
      </div>
    </div>
  );
};

export default PlaceholderImage;