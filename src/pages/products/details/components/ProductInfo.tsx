import React from 'react';
import { ProductType } from '../../../../api/products/types';
import { SuprasyRender } from 'suprasy-render-react';

interface ProdcutInfoPropTypes {
  ProductDetails: ProductType;
}

const ProductInfo: React.FC<ProdcutInfoPropTypes> = ({ ProductDetails }) => {
  return (
    <div>
      <h1 className="text-4xl font-medium">{ProductDetails.Title}</h1>
      <div className="my-3">
        <SuprasyRender initialVal={ProductDetails.Summary} />
      </div>
    </div>
  );
};

export default ProductInfo;
