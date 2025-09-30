import { useState } from 'react';

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  className = '',
  fallbackClassName = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Size variants
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on name
  const getColorFromName = (name) => {
    if (!name) return 'bg-gray-500';
    
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];
    
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const baseClasses = `inline-flex items-center justify-center rounded-full ${sizeClasses[size]} ${className}`;

  // Show loading state while image is loading
  if (src && !imageError && !imageLoaded) {
    return (
      <div className={`${baseClasses} bg-gray-200 animate-pulse`}>
        <div className="h-full w-full rounded-full bg-gray-300"></div>
        <img
          src={src}
          alt={alt || name}
          className="hidden"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Show image if it loaded successfully
  if (src && !imageError && imageLoaded) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${baseClasses} object-cover`}
        onError={() => setImageError(true)}
      />
    );
  }

  // Show initials fallback
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return (
    <div 
      className={`${baseClasses} ${bgColor} text-white font-medium ${fallbackClassName}`}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;