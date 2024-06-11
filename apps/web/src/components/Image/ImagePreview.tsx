import React, { useState } from 'react';
import cn from 'classnames';

import './styles.css';

const ImagePreview: React.FC<{
  alt: string;
  className?: string;
  src: string;
  sizes?: string;
}> = ({ alt, className, src, sizes }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    requestAnimationFrame(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className={cn(className, 'image-preview')}>
      {isLoading && (
        <div
          className={cn(
            className,
            'flex justify-center items-center bg-[#e8e8e8] text-white'
          )}
        >
          <div className="loader"></div>
        </div>
      )}

      <img
        sizes={sizes || ''}
        src={src}
        alt={alt}
        className={cn({ hidden: isLoading }, className)}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ImagePreview;
