import { Button, useToast } from '@frontend.suprasy.com/ui';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  calculateDiscountPercentage,
  formatPrice,
} from '@web/libs/helpers/formatPrice';
import {
  getProductImagesOption,
  getProductsDetailsByIdOption,
  getProductVariations,
} from '@web/api/products';
import { useCartStore } from '@web/store/cartStore';
import React, { useMemo } from 'react';
import ImagePreview from '../Image/ImagePreview';
import cn from 'classnames';
import { Image } from 'lucide-react';

const ProductCard: React.FC<{ ProductId: number }> = ({ ProductId }) => {
  const { data: productsDetailsResponse } = useSuspenseQuery(
    getProductsDetailsByIdOption(ProductId)
  );

  const { toast } = useToast();

  const productDetails = productsDetailsResponse?.Data;

  const { data: productImagesResponse } = useSuspenseQuery(
    getProductImagesOption(ProductId)
  );

  const { data: productVariationsResponse } = useQuery({
    queryKey: ['getProductVariations', productDetails?.Id],
    queryFn: () => getProductVariations(productDetails?.Id || 0),
    enabled: !!productDetails?.Id,
  });

  const productVariation = productVariationsResponse?.Data[0];

  const productImages = productImagesResponse?.Data;

  const {
    addToCart,
    cart,
    setQuantity: setQtyCart,
    clearCart,
  } = useCartStore((state) => state);

  const navigate = useNavigate();

  const inStock = true;

  const ProductID = productDetails?.Id;
  const selectedVariation = productVariation?.Id;

  const isVariationUnderQty = useMemo(() => {
    const cartVariation = cart?.find(
      (c) => c.VariationId === selectedVariation
    );

    const variation = productVariationsResponse?.Data?.find(
      (v) => v.Id === selectedVariation
    );

    if ((variation?.Inventory || 0) > (cartVariation?.Quantity || 0)) {
      return true;
    }

    return false;
  }, [cart, productVariationsResponse?.Data, selectedVariation]);

  const isOnSale =
    productVariation?.SalesPrice &&
    calculateDiscountPercentage(
      productVariation?.SalesPrice,
      productVariation?.Price
    ) < 0;

  return (
    <div className="w-[310px] md:max-w-[274px] h-[424px] hover:cursor-pointer">
      <div className="rounded-md overflow-hidden  relative">
        <Link
          to="/products/$slug"
          params={{ slug: productDetails?.Slug || '/' }}
        >
          <div>
            <div
              className={cn(
                'h-[200px]',
                !productImages &&
                  'bg-slate-200 flex justify-center items-center'
              )}
            >
              {productImages && productImages.length > 0 && (
                <ImagePreview
                  className="w-full h-[200px] object-fill"
                  src={productImages[0].ImageUrl}
                  alt="product"
                />
              )}

              {!productImages && (
                <Image size={'50px'} className="text-slate-400" />
              )}
            </div>

            <div className="p-2">
              <div className="font-normal text-base mb-2">
                {productDetails?.Title}
              </div>

              <p className="text-gray-700 text-base">
                {productVariation?.SalesPrice && isOnSale && (
                  <span className="font-light line-through mr-3">
                    {formatPrice(productVariation?.Price)}
                  </span>
                )}

                <span className="font-medium text-base">
                  {formatPrice(productVariation?.SalesPrice || 0)}
                </span>
              </p>
            </div>
          </div>
        </Link>

        {isOnSale && (
          <span className="bg-green-600 text-sm font-light text-white px-2 py-1 absolute top-5 right-5 rounded-tr ">
            {calculateDiscountPercentage(
              productVariation?.SalesPrice,
              productVariation?.Price
            ).toFixed(2)}
            % off
          </span>
        )}

        <div className="my-2 ">
          {!inStock && (
            <h1 className="text-center h-full p-3 bg-slate-200 rounded-md">
              Out of stock
            </h1>
          )}
          {inStock && (
            <>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (selectedVariation && ProductID && isVariationUnderQty) {
                    addToCart({
                      ProductId: ProductID,
                      VariationId: selectedVariation,
                      Quantity: 1,
                    });
                  } else {
                    toast({
                      variant: 'destructive',
                      title: 'Stock alert',
                      description: 'Not enought item in stock',
                    });
                  }
                }}
                className="w-full my-1 bg-white border-2 border-gray-700 text-black hover:bg-white hover:shadow-lg"
              >
                Add to cart
              </Button>
              <Button
                onClick={(e) => {
                  if (selectedVariation && ProductID && isVariationUnderQty) {
                    addToCart({
                      ProductId: ProductID,
                      VariationId: selectedVariation,
                      Quantity: 1,
                    });

                    // redirect to checkout
                    navigate({ to: '/checkout' });
                  } else {
                    toast({
                      variant: 'destructive',
                      title: 'Stock alert',
                      description: 'Not enought item in stock',
                    });
                  }
                }}
                className="w-full my-1 bg-green-500 hover:bg-green-500 hover:shadow-lg"
              >
                Buy it now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
