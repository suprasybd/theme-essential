import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  getProductImagesOption,
  getProductVariations,
  getProductsDetails,
} from '../api';
import { RichTextRender, Button, useToast } from '@frontend.suprasy.com/ui';
import cn from 'classnames';
import ProductImages from './components/ProductImages';

import {
  calculateDiscountPercentage,
  formatPrice,
} from '@web/libs/helpers/formatPrice';
import { useCartStore } from '@web/store/cartStore';

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
    ) !== 0;

  return (
    <section className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3 lg:row-end-1">
              {productImages && (
                <ProductImages
                  key={selectedVariation.toString()}
                  Images={productImages}
                />
              )}
            </div>

            <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
              {productDetails && (
                <div>
                  <h1 className="text-4xl font-normal tracking-wide">
                    {productDetails.Title}
                  </h1>

                  <p className="text-xl font-normal my-3 tracking-wider">
                    <div>
                      {productVariation?.SalesPrice && isOnSale && (
                        <span className="inline-block mr-3 line-through">
                          {formatPrice(productVariation?.SalesPrice)}
                        </span>
                      )}
                      {formatPrice(productVariation?.Price || 0)}
                      {productVariation?.SalesPrice && isOnSale && (
                        <span className="inline-block ml-3 bg-green-500 text-white p-1 text-sm rounded-sm">
                          {calculateDiscountPercentage(
                            productVariation?.SalesPrice,
                            productVariation?.Price
                          ).toFixed(2)}
                          % off
                        </span>
                      )}
                    </div>
                  </p>

                  <div className="my-3">
                    <RichTextRender
                      className="min-h-fit"
                      initialVal={productDetails.Summary}
                    />
                  </div>
                </div>
              )}

              {/* has variant? */}

              <div className="flex items-center my-2 bg-slate-200 rounded-lg p-3 w-fit">
                <p className="mr-1">Status: </p>
                <p className="text-sm font-bold">In Stock</p>
              </div>

              <div className="flex flex-wrap gap-[5px]">
                {productVariationsResponse?.Data?.map((variation) => (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVariation(variation.Id);
                    }}
                    className={cn(
                      variation.Id === selectedVariation
                        ? 'bg-black'
                        : 'bg-slate-400'
                    )}
                  >
                    {variation.ChoiceName}
                  </Button>
                ))}
              </div>

              {productVariationsResponse?.Data?.find(
                (v) => v.Id === selectedVariation
              )?.Inventory || 0 >= 1 ? (
                <div className="text-green-600 text-sm">
                  <span>
                    {
                      productVariationsResponse?.Data?.find(
                        (v) => v.Id === selectedVariation
                      )?.Inventory
                    }{' '}
                    avaliable
                  </span>
                </div>
              ) : (
                <div className="text-red-400 text-sm">
                  <span>out of stock</span>
                </div>
              )}

              <span className="block mb-2 ">Quantity</span>
              <div className="flex">
                <button
                  className="border border-r-0 border-gray-400 py-1 px-5 font-bold rounded-l-full hover:!bg-slate-200"
                  onClick={(e) => {
                    e.preventDefault();
                    if (quantity - 1 >= 1) {
                      setQuantity(quantity - 1);
                    }
                  }}
                >
                  -
                </button>
                <input
                  onChange={(e) => {
                    setQuantity(parseInt(e.target.value) || 1);
                  }}
                  type="text"
                  className="border w-[50px] border-gray-400 text-center"
                  value={quantity}
                  step={'any'}
                />
                <button
                  className="border border-l-0 border-gray-400 py-1 px-5 font-bold rounded-r-full hover:!bg-slate-200"
                  onClick={(e) => {
                    e.preventDefault();

                    setQuantity(quantity + 1);
                  }}
                >
                  +
                </button>
              </div>
              <div className="my-3">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (selectedVariation && ProductID && isVariationUnderQty) {
                      addToCart({
                        ProductId: ProductID,
                        VariationId: selectedVariation,
                        Quantity: quantity,
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
                    e.preventDefault();
                    if (selectedVariation && ProductID && isVariationUnderQty) {
                      addToCart({
                        ProductId: ProductID,
                        VariationId: selectedVariation,
                        Quantity: quantity,
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
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-medium text-xl mb-5">Description</h2>
            {productDetails?.Description && (
              <RichTextRender initialVal={productDetails?.Description} />
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default ProductDetails;
