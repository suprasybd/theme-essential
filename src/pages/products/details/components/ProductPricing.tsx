import React from 'react';
import {
  formatPrice,
  calculateDiscountPercentage,
} from '@/libs/helpers/formatPrice';

interface ProductPricingProps {
  price: number;
  salesPrice?: number;
}

const ProductPricing: React.FC<ProductPricingProps> = ({
  price,
  salesPrice,
}) => {
  const isOnSale =
    salesPrice && calculateDiscountPercentage(salesPrice, price) < 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl font-semibold">{formatPrice(price)}</span>
      {isOnSale && (
        <>
          <span className="text-lg text-gray-500 line-through">
            {formatPrice(salesPrice)}
          </span>
          <span className="px-2 py-1 text-sm font-medium text-white bg-green-500 rounded">
            {Math.abs(calculateDiscountPercentage(salesPrice, price)).toFixed(
              0
            )}
            % OFF
          </span>
        </>
      )}
    </div>
  );
};

export default ProductPricing;
