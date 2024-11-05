import { RENDER_URL } from '@/config/api';
import React, { useEffect } from 'react';

const RenderProductRichText: React.FC<{
  productId: number;

  summary?: boolean;
}> = ({ productId, storeKey, summary }) => {
  return (
    <iframe
      title="produ"
      src={`${RENDER_URL}/render/productiondescription?productId=${productId}&storeKey=${storeKey}&summary=${
        summary || false
      }`}
    ></iframe>
  );
};

export default RenderProductRichText;
