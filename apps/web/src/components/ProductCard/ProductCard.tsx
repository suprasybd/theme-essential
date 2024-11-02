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
    <div className="w-[310px] md:max-w-[274px] h-fit hover:cursor-pointer group">
      <div className="rounded-lg overflow-hidden relative border border-gray-200 hover:border-gray-300 transition-all duration-200">
        <Link
          to="/products/$slug"
          params={{ slug: productDetails?.Slug || '/' }}
          className="block relative"
        >
          <div
            className={cn(
              'h-[200px] relative overflow-hidden',
              !productImages && 'bg-slate-200 flex justify-center items-center'
            )}
          >
            {productImages && productImages.length > 0 && (
              <>
                <ImagePreview
                  className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-110"
                  src={productImages[0].ImageUrl}
                  alt={productDetails?.Title || 'product'}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-slate-500"
                  >
                    Quick View
                  </Button>
                </div>
              </>
            )}
            {!productImages && (
              <Image size={'50px'} className="text-slate-400" />
            )}
          </div>

          {isOnSale && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
              {Math.abs(
                calculateDiscountPercentage(
                  productVariation?.SalesPrice,
                  productVariation?.Price
                )
              ).toFixed(0)}
              % OFF
            </span>
          )}

          <div className="p-4">
            <h3 className="font-medium text-base mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
              {productDetails?.Title}
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-semibold text-lg">
                {formatPrice(
                  productVariation?.SalesPrice || productVariation?.Price || 0
                )}
              </span>
              {productVariation?.SalesPrice && isOnSale && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(productVariation?.Price)}
                </span>
              )}
            </div>

            <div className="text-sm mb-3">
              {productVariation?.Inventory && productVariation.Inventory > 0 ? (
                <span className="text-green-600">
                  {productVariation.Inventory} in stock
                </span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </div>
          </div>
        </Link>

        <div className="p-4 pt-0">
          <div className="flex gap-2">
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
                    description: 'Not enough items in stock',
                  });
                }
              }}
              className="flex-1 bg-white border-2 border-gray-700 text-black hover:bg-gray-50"
              disabled={!inStock || !isVariationUnderQty}
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
                  navigate({ to: '/checkout' });
                }
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={!inStock || !isVariationUnderQty}
            >
              Buy now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
