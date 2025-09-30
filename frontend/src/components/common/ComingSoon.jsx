const ComingSoon = ({ 
  title = "Coming Soon", 
  description = "This feature is currently under development and will be available soon.",
  icon = null,
  className = ""
}) => {
  const defaultIcon = (
    <svg className="h-16 w-16 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 01-2.828-2.828l-1.838-1.838a2 2 0 012.828-2.828l1.838 1.838a2 2 0 01-2.828 2.828zM5.757 5.757a2 2 0 012.828 0L12 9.172l3.415-3.415a2 2 0 012.828 2.828L14.828 12l3.415 3.415a2 2 0 01-2.828 2.828L12 14.828l-3.415 3.415a2 2 0 01-2.828-2.828L9.172 12 5.757 8.585a2 2 0 010-2.828z" />
    </svg>
  );

  return (
    <div className={`min-h-[80vh] flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="flex justify-center mb-6">
          {icon || defaultIcon}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-indigo-700">
                <strong>Development Status:</strong> In Progress
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Enhanced user experience</p>
          <p>• Modern design patterns</p>
          <p>• Mobile-responsive interface</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;