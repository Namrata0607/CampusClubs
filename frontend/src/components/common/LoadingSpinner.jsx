const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  variant = 'default' // default, minimal, pulse
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const containerSizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12',
    xl: 'p-16'
  };

  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <div className={`animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600 ${sizeClasses[size]}`}></div>
        {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${containerSizeClasses[size]} ${className}`}>
        <div className="flex space-x-2">
          <div className="h-3 w-3 bg-indigo-600 rounded-full animate-pulse"></div>
          <div className="h-3 w-3 bg-indigo-600 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
          <div className="h-3 w-3 bg-indigo-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        </div>
        {text && <p className="mt-3 text-sm text-gray-600 text-center">{text}</p>}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex flex-col items-center justify-center ${containerSizeClasses[size]} ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 ${sizeClasses[size]}`}></div>
      {text && <p className="mt-3 text-sm text-gray-600 text-center">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;