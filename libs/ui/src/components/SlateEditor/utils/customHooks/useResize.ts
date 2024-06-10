import { useEffect, useState } from 'react';

const useResize = (defautlWidth, defaultHeight) => {
  const [size, setSize] = useState({
    width: defautlWidth || 300,
    height: defaultHeight || 300,
  });
  useEffect(() => {
    if (defaultHeight || defautlWidth) {
      setSize({ height: defaultHeight, width: defautlWidth });
    }
  }, [defaultHeight, defautlWidth]);

  const [resizing, setResizing] = useState(false);
  const onMouseDown = () => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    setResizing(true);
  };
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    setResizing(false);
  };
  const onMouseMove = (e) => {
    setSize((currentSize) => ({
      width: currentSize.width + e.movementX,
      height: currentSize.height + e.movementY,
    }));
  };

  return [size, onMouseDown, resizing];
};

export default useResize;
