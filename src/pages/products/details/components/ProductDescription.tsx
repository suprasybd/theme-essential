import React from 'react';
import { getProductsDetailsById } from '../../../../api/products';
import { useQuery } from '@tanstack/react-query';
import { SuprasyRender } from 'suprasy-render-react';

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
        <SuprasyRender initialVal={productDetails?.Description} />
      )}
    </div>
  );
};

export default ProductDescription;
