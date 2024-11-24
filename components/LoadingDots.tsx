import React from 'react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex space-x-2 animate-pulse">
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
    </div>
  );
};

export default LoadingDots;

