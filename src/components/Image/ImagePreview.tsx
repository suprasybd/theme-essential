import React, { useState } from 'react';
import cn from 'classnames';

import './styles.css';
import { Image } from 'lucide-react';

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
    <div
      className={cn(
        className,
        'image-preview',
        isLoading && 'bg-slate-200 flex justify-center items-center'
      )}
    >
      {isLoading && <Image size={'50px'} className="text-slate-400" />}

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
