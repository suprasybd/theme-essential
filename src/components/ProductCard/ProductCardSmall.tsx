import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { formatPrice } from '@/libs/helpers/formatPrice';
import {
  getProductImages,
  getProductImagesOption,
  getProductsDetailsByIdOption,
  getProductVariations,
} from '@/api/products';
import React from 'react';
import ImagePreview from '../Image/ImagePreview';
import cn from 'classnames';
import { Image } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const ProductCardSmall: React.FC<{
  ProductId: number;
  setModal?: (s: boolean) => void;
}> = ({ ProductId, setModal }) => {
  const { data: productsDetailsResponse } = useSuspenseQuery(
    getProductsDetailsByIdOption(ProductId)
  );

  const productDetails = productsDetailsResponse?.Data;

  // Get variations first
  const { data: productVariationsResponse } = useSuspenseQuery({
    queryKey: ['getProductVariations', ProductId],
    queryFn: () => getProductVariations(ProductId),
  });

  const variation = productVariationsResponse?.Data?.[0];

  // Use variation ID to get images
  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImages', variation?.Id],
    queryFn: () => getProductImages(variation?.Id || 0),
    enabled: !!variation?.Id,
  });

  const productImages = productImagesResponse?.Data;

  const handleClick = () => {
    setModal?.(false);
  };

  return (
    <div className="w-full hover:cursor-pointer group">
      <Link
        to="/products/$slug"
        params={{ slug: productDetails?.Slug || '/' }}
        className="block"
        onClick={handleClick}
      >
        <div className="rounded-lg border border-gray-100 hover:border-gray-200 overflow-hidden p-3 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'w-[80px] h-[80px] rounded-md overflow-hidden flex-shrink-0',
                !productImages &&
                  'bg-slate-100 flex justify-center items-center'
              )}
            >
              {productImages && productImages.length > 0 ? (
                <ImagePreview
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  src={productImages[0].ImageUrl}
                  alt={productDetails?.Title || 'product'}
                />
              ) : (
                <Image size={'40px'} className="text-slate-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                {productDetails?.Title}
              </h3>

              {variation && (
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-base">
                    {formatPrice(variation.SalesPrice || variation.Price)}
                  </span>
                  {variation.SalesPrice &&
                    variation.SalesPrice < variation.Price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(variation.Price)}
                      </span>
                    )}
                </div>
              )}

              {variation && (
                <p className="text-sm text-gray-600 mt-1">
                  {variation.Inventory > 0 ? (
                    <span className="text-green-600">
                      {variation.Inventory} in stock
                    </span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCardSmall;
