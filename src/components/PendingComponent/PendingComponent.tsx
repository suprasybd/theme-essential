import { Loader } from 'lucide-react';
import cn from 'classnames';
import React from 'react';

const PendingComponent = ({ hScreen }: { hScreen?: boolean }) => {
  return (
    <div
      className={cn(
        'w-full flex justify-center items-center',
        hScreen && 'h-screen'
      )}
    >
      <Loader />
    </div>
  );
};

export default PendingComponent;
