import React from 'react';
import { getProductsDetailsById } from '../../api';
import { useQuery } from '@tanstack/react-query';
import { RichTextRender } from '@frontend.suprasy.com/ui';

const ProductDescription: React.FC<{ ProductId: number }> = ({ ProductId }) => {
  const { data: productsDetailsResponse } = useQuery({
    queryKey: ['GetProductDescription', ProductId],
    queryFn: () => getProductsDetailsById(ProductId.toString()),
    enabled: !!ProductDescription,
  });

  const productDetails = productsDetailsResponse?.Data;

  return (
    <div>
      <h1 className="font-bold text-xl my-4">
        Product Name: {productDetails?.Title}
      </h1>
      {productDetails?.Description && (
        <RichTextRender initialVal={productDetails?.Description} />
      )}
    </div>
  );
};

export default ProductDescription;
