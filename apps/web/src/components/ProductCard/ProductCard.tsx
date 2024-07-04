import { Button, useToast } from '@frontend.suprasy.com/ui';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  calculateDiscountPercentage,
  formatPrice,
} from '@web/libs/helpers/formatPrice';
import {
  getProductAttributeName,
  getProductAttributeOptions,
  getProductImagesOption,
  getProductSkuOption,
  getProductsDetailsByIdOption,
} from '@web/pages/products/api';
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

  const { data: productSkuResponse } = useSuspenseQuery(
    getProductSkuOption(ProductId)
  );

  const { data: attributeNameResponse } = useQuery({
    queryKey: ['getProductAttributeName', productDetails?.Id],
    queryFn: () => getProductAttributeName(productDetails?.Id || 0),
    // enabled: productDetails?.HasVariant && !!productDetails?.Id,
    enabled: false,
  });

  const { data: attributeOptionsResponse } = useQuery({
    queryKey: ['getProductAttributeOptions', productDetails?.Id],
    queryFn: () => getProductAttributeOptions(productDetails?.Id || 0),
    // enabled: productDetails?.HasVariant && !!productDetails?.Id,
    enabled: false,
  });

  const productImages = productImagesResponse?.Data;
  const productSku = productSkuResponse?.Data;
  const HasVariant = productDetails?.HasVariant;
  const productAttributeName = attributeNameResponse?.Data;
  const productAttributeOptions = attributeOptionsResponse?.Data;

  const {
    addToCart,
    cart,
    setQuantity: setQtyCart,
    clearCart,
  } = useCartStore((state) => state);

  const navigate = useNavigate();

  const inStock = useMemo(() => {
    return productSku?.some((sk) => sk.Inventory > 0);
  }, [productSku]);

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

              {productSku && productSku.length > 0 && (
                <p className="text-gray-700 text-base">
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
        </Link>

        {productSku &&
          productSku.length > 0 &&
          productSku[0].ShowCompareAtPrice && (
            <span className="bg-green-600 text-sm font-light text-white px-2 py-1 absolute top-5 right-5 rounded-tr ">
              {calculateDiscountPercentage(
                productSku[0].CompareAtPrice,
                productSku[0].Price
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
                  if (productDetails && productDetails?.HasVariant) {
                    productSku?.forEach((sku) => {
                      const skuInStock = productSku.find(
                        (sk) => sk.Inventory > 0
                      );
                      if (sku.Id === skuInStock?.Id) {
                        // if already have increase qty
                        const attr = productAttributeOptions?.find(
                          (o) => o.Id === sku.AttributeOptionId
                        );
                        if (
                          cart.find(
                            (c) =>
                              c.ProductId === sku.ProductId &&
                              c.ProductAttribute === attr?.Value
                          )
                        ) {
                          const theCartItem = cart.find(
                            (c) =>
                              c.ProductId === sku.ProductId &&
                              c.ProductAttribute === attr?.Value
                          );

                          // check if enough stock
                          if (
                            sku.Inventory <
                            (theCartItem?.Quantity || 0) + 1
                          ) {
                            toast({
                              variant: 'destructive',
                              title: 'Stock Alert',
                              description: 'Not enough items in stock.',
                            });
                            return;
                          }
                          setQtyCart(
                            theCartItem?.Id || '0',
                            (theCartItem?.Quantity || 0) + 1
                          );
                          return;
                        }
                        // check if enough stock
                        if (sku.Inventory < 1) {
                          toast({
                            variant: 'destructive',
                            title: 'Stock Alert',
                            description: 'Not enough items in stock.',
                          });
                          return;
                        }
                        // if not already in cart add it
                        addToCart({
                          ProductId: productDetails?.Id,
                          Quantity: 1,
                          ProductAttribute: attr?.Value,
                        });
                      }
                    });
                  }

                  if (productDetails && !productDetails.HasVariant) {
                    // if already have increase qty
                    if (cart.find((c) => c.ProductId === productDetails.Id)) {
                      const theCartItem = cart.find(
                        (c) => c.ProductId === productDetails.Id
                      );
                      setQtyCart(
                        theCartItem?.Id || '0',
                        (theCartItem?.Quantity || 0) + 1
                      );
                      return;
                    }
                    // if not already in cart add it
                    addToCart({
                      ProductId: productDetails?.Id,
                      Quantity: 1,
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
                  clearCart();

                  if (productDetails && productDetails?.HasVariant) {
                    clearCart();
                    const skuInStock = productSku.find(
                      (sk) => sk.Inventory > 0
                    );

                    if (!skuInStock) return;
                    if (productSku && productSku.length > 0) {
                      const attr = productAttributeOptions?.find(
                        (o) => o.Id === skuInStock.AttributeOptionId
                      );

                      if (attr) {
                        addToCart({
                          ProductId: productDetails?.Id,
                          Quantity: 1,
                          ProductAttribute: attr.Value,
                        });
                      }
                    }
                  }

                  if (productDetails && !productDetails.HasVariant) {
                    clearCart();
                    // if not already in cart add it
                    addToCart({
                      ProductId: productDetails?.Id,
                      Quantity: 1,
                    });
                  }

                  // redirect to checkout
                  navigate({ to: '/checkout' });
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
