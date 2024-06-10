import React from 'react';
import { ProductType } from '../../api/types';
import { RichTextRender } from '@frontend.suprasy.com/ui';

interface ProdcutInfoPropTypes {
  ProductDetails: ProductType;
}

const ProductInfo: React.FC<ProdcutInfoPropTypes> = ({ ProductDetails }) => {
  return (
    <div>
      <h1 className="text-4xl font-medium">{ProductDetails.Title}</h1>
      <div className="my-3">
        <RichTextRender initialVal={ProductDetails.Summary} />
      </div>
    </div>
  );
};

export default ProductInfo;
