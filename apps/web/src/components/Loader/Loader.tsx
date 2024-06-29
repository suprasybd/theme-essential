import React from 'react';
import cn from 'classnames';

const FullScreenLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-gray-500 bg-opacity-50',
        className
      )}
    >
      <div className="flex justify-center items-center  rounded-full p-5">
        <svg
          className="animate-spin h-40 w-40 text-gray-800 lucide lucide-loader-circle"
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="0.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    </div>
  );
};

export default FullScreenLoader;
