const PlaceholderImage = ({ size = 40, text = "C", className = "" }) => {
  const sizeClasses = {
    32: "h-8 w-8 text-sm",
    40: "h-10 w-10 text-base",
    48: "h-12 w-12 text-lg",
    64: "h-16 w-16 text-xl"
  };

  return (
    <div className={`bg-indigo-600 rounded-lg flex items-center justify-center ${sizeClasses[size] || sizeClasses[40]} ${className}`}>
      <span className="text-white font-bold">{text}</span>
    </div>
  );
};

export default PlaceholderImage;