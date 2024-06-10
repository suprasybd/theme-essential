import { Button } from '@frontend.suprasy.com/ui';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  calculateDiscountPercentage,
  formatPrice,
} from '@web/libs/helpers/formatPrice';
import {
  getProductAttributeName,
  getProductAttributeOptions,
  getProductImages,
  getProductSku,
  getProductsDetails,
  getProductsDetailsById,
} from '@web/pages/products/api';
import { useCartStore } from '@web/store/cartStore';
import React from 'react';

const ProductCard: React.FC<{ ProductId: number }> = ({ ProductId }) => {
  const { data: productsDetailsResponse } = useQuery({
    queryKey: ['getProductsDetails', ProductId],
    queryFn: () => getProductsDetailsById(ProductId.toString()),
    enabled: !!ProductId,
  });

  const productDetails = productsDetailsResponse?.Data;

  const { data: productImagesResponse } = useQuery({
    queryKey: ['getProductImages', productDetails?.Id],
    queryFn: () => getProductImages(productDetails?.Id || 0),
    enabled: !!productDetails?.Id,
  });

  const { data: productSkuResponse } = useQuery({
    queryKey: ['getProductSku', productDetails?.Id],
    queryFn: () => getProductSku(productDetails?.Id || 0),
    enabled: !!productDetails?.Id,
  });

  const { data: attributeNameResponse } = useQuery({
    queryKey: ['getProductAttributeName', productDetails?.Id],
    queryFn: () => getProductAttributeName(productDetails?.Id || 0),
    enabled: productDetails?.HasVariant && !!productDetails?.Id,
  });

  const { data: attributeOptionsResponse } = useQuery({
    queryKey: ['getProductAttributeOptions', productDetails?.Id],
    queryFn: () => getProductAttributeOptions(productDetails?.Id || 0),
    enabled: productDetails?.HasVariant && !!productDetails?.Id,
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

  return (
    <div className="max-w-[274px] h-[424px] hover:cursor-pointer">
      <div className="rounded-md overflow-hidden  relative">
        <Link
          to="/products/$slug"
          params={{ slug: productDetails?.Slug || '/' }}
        >
          <div>
            {productImages && productImages.length > 0 && (
              <img
                className="w-full h-[200px] object-fill"
                src={productImages[0].ImageUrl}
                alt="Zifriend ZA981 Gaming Headset"
              />
            )}

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

        <div className="my-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (productDetails && productDetails?.HasVariant) {
                productSku?.forEach((sku) => {
                  if (sku.Id === productSku[0].Id) {
                    // if already have increase qty
                    if (
                      cart.find(
                        (c) =>
                          c.ProductId === sku.ProductId &&
                          c.ProductAttribute === sku.AttributeOptionId
                      )
                    ) {
                      const theCartItem = cart.find(
                        (c) =>
                          c.ProductId === sku.ProductId &&
                          c.ProductAttribute === sku.AttributeOptionId
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
                      ProductAttribute: sku.AttributeOptionId,
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
                productSku?.forEach((sku) => {
                  if (sku.Id === productSku[0].Id) {
                    // if already have increase qty
                    if (
                      cart.find(
                        (c) =>
                          c.ProductId === sku.ProductId &&
                          c.ProductAttribute === sku.AttributeOptionId
                      )
                    ) {
                      const theCartItem = cart.find(
                        (c) =>
                          c.ProductId === sku.ProductId &&
                          c.ProductAttribute === sku.AttributeOptionId
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
                      ProductAttribute: sku.AttributeOptionId,
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

              // redirect to checkout
              navigate({ to: '/checkout' });
            }}
            className="w-full my-1 bg-green-500 hover:bg-green-500 hover:shadow-lg"
          >
            Buy it now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
