import { useSuspenseQuery } from '@tanstack/react-query';
import { formatPrice } from '@web/libs/helpers/formatPrice';
import {
  getProductImagesOption,
  getProductSkuOption,
  getProductsDetailsByIdOption,
} from '@web/pages/products/api';
import React from 'react';
import ImagePreview from '../Image/ImagePreview';
import cn from 'classnames';
import { Image } from 'lucide-react';

const ProductCardSmall: React.FC<{
  ProductId: number;
  setModal?: (s: boolean) => void;
}> = ({ ProductId, setModal }) => {
  const { data: productsDetailsResponse } = useSuspenseQuery(
    getProductsDetailsByIdOption(ProductId)
  );

  const productDetails = productsDetailsResponse?.Data;

  const { data: productImagesResponse } = useSuspenseQuery(
    getProductImagesOption(ProductId)
  );

  const { data: productSkuResponse } = useSuspenseQuery(
    getProductSkuOption(ProductId)
  );

  const productImages = productImagesResponse?.Data;
  const productSku = productSkuResponse?.Data;

  return (
    <div className="w-full h-fit hover:cursor-pointer">
      <div className="rounded-md overflow-hidden p-2 hover:bg-green-400 hover:text-white relative">
        <a href={`/products/${productDetails?.Slug || '/'}`}>
          <div className="flex w-full items-center">
            <div
              className={cn(
                !productImages &&
                  'bg-slate-200 flex justify-center items-center'
              )}
            >
              {productImages && productImages.length > 0 && (
                <ImagePreview
                  className="w-[60px] h-[60px] object-fill rounded-md"
                  src={productImages[0].ImageUrl}
                  alt="product"
                />
              )}

              {!productImages && (
                <Image size={'50px'} className="text-slate-400" />
              )}
            </div>

            <div className="p-2">
              <div className="font-normal  text-base mb-2">
                {productDetails?.Title}
              </div>

              {productSku && productSku.length > 0 && (
                <p className=" text-base">
                  {productSku[0].ShowCompareAtPrice && (
                    <span className="font-light line-through mr-3">
                      {formatPrice(productSku[0].CompareAtPrice)}
                    </span>
                  )}

                  <span className="font-medium text-base">
                    {formatPrice(productSku[0].Price)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default ProductCardSmall;
