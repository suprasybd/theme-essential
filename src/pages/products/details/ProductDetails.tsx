import { Button, useToast } from '@/components/ui';
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import cn from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { SuprasyRender } from 'suprasy-render-react';
import {
  getProductImagesOption,
  getProductVariations,
  getProductsDetails,
} from '../../../api/products';
import ProductImages from './components/ProductImages';

import {
  calculateDiscountPercentage,
  formatPrice,
} from '@/libs/helpers/formatPrice';
import { useCartStore } from '@/store/cartStore';
import ProductPricing from './components/ProductPricing';

export const getProductsDetailsOptions = (slug: string) =>
  queryOptions({
    queryKey: ['getProductsDetails', slug],
    queryFn: () => getProductsDetails(slug),
    enabled: !!slug,
  });

const ProductDetails: React.FC = () => {
  const { slug } = useParams({ strict: false }) as { slug: string };

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariation, setSelectedVariation] = useState<number>(0);

  const { toast } = useToast();

  const {
    addToCart,
    cart,
    setQuantity: setQtyCart,
    clearCart,
  } = useCartStore((state) => state);

  const { data: productsDetailsResponse } = useSuspenseQuery(
    getProductsDetailsOptions(slug)
  );

  const productDetails = productsDetailsResponse?.Data;

  const ProductID = productDetails?.Id;

  const { data: productImagesResponse } = useSuspenseQuery(
    getProductImagesOption(selectedVariation)
  );

  const { data: productVariationsResponse } = useQuery({
    queryKey: ['getProductVariations', productDetails?.Id],
    queryFn: () => getProductVariations(productDetails?.Id || 0),
    enabled: !!productDetails?.Id,
  });

  const productImages =
    productImagesResponse?.Data &&
    productImagesResponse?.Data?.length > 0 &&
    productImagesResponse?.Data;

  const productVariation = productVariationsResponse?.Data?.find(
    (v) => v.Id === selectedVariation
  );

  useEffect(() => {
    if (
      productVariationsResponse?.Data &&
      productVariationsResponse?.Data?.length > 0
    ) {
      setSelectedVariation(productVariationsResponse?.Data[0].Id);
    }
  }, [productVariationsResponse?.Data]);

  const navigate = useNavigate();

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
    <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Left column - Product Images */}
        <div className="w-full">
          {productImages && (
            <ProductImages
              key={selectedVariation.toString()}
              Images={productImages}
            />
          )}
        </div>

        {/* Right column - Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          {productDetails && (
            <>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {productDetails.Title}
              </h1>

              <div className="mt-6">
                <ProductPricing
                  price={productVariation?.Price || 0}
                  salesPrice={productVariation?.SalesPrice}
                />
              </div>

              <div className="mt-6">
                <SuprasyRender
                  className="prose prose-sm max-w-none min-h-fit"
                  initialVal={productDetails.Summary}
                />
              </div>

              {/* Variations */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900">
                  Variations
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {productVariationsResponse?.Data?.map((variation) => (
                    <Button
                      key={variation.Id}
                      onClick={() => setSelectedVariation(variation.Id)}
                      className={cn(
                        'px-4 py-2 rounded-full transition-all',
                        variation.Id === selectedVariation
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      )}
                    >
                      {variation.ChoiceName}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Inventory Status */}
              <div className="mt-6">
                {productVariation?.Inventory &&
                productVariation.Inventory > 0 ? (
                  <p className="text-sm text-green-600">
                    {productVariation.Inventory} items available
                  </p>
                ) : (
                  <p className="text-sm text-red-600">Out of stock</p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <div className="mt-2 flex rounded-md">
                  <button
                    className="px-4 py-2 border border-r-0 border-gray-300 rounded-l-md hover:bg-gray-50"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="w-20 text-center border-y border-gray-300"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                  <button
                    className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-4">
                <Button
                  onClick={() => {
                    if (selectedVariation && ProductID && isVariationUnderQty) {
                      addToCart({
                        ProductId: ProductID,
                        VariationId: selectedVariation,
                        Quantity: quantity,
                      });
                      toast({
                        title: 'Success',
                        description: 'Item added to cart',
                        variant: 'default',
                      });
                    } else {
                      toast({
                        variant: 'destructive',
                        title: 'Stock alert',
                        description: 'Not enough items in stock',
                      });
                    }
                  }}
                  className="w-full py-3 bg-white border-2 border-black text-black hover:bg-gray-50"
                  disabled={!isVariationUnderQty}
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={() => {
                    if (selectedVariation && ProductID && isVariationUnderQty) {
                      addToCart({
                        ProductId: ProductID,
                        VariationId: selectedVariation,
                        Quantity: quantity,
                      });
                      navigate({ to: '/checkout' });
                    }
                  }}
                  className="w-full py-3 bg-green-600 text-white hover:bg-green-700"
                  disabled={!isVariationUnderQty}
                >
                  Buy Now
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
          Description
        </h2>
        {productDetails?.Description && (
          <div className="prose prose-sm max-w-none">
            <SuprasyRender initialVal={productDetails.Description} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
