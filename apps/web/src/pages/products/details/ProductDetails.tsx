import { useQuery } from '@tanstack/react-query';
import { redirect, useNavigate, useParams } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import {
  getProductAttributeName,
  getProductAttributeOptions,
  getProductImages,
  getProductSku,
  getProductsDetails,
} from '../api';
import {
  RichTextRender,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Card,
  CardContent,
  Button,
} from '@frontend.suprasy.com/ui';
import cn from 'classnames';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import {
  calculateDiscountPercentage,
  formatPrice,
} from '@web/libs/helpers/formatPrice';
import { useCartStore } from '@web/store/cartStore';

const ProductDetails: React.FC = () => {
  const { slug } = useParams({ strict: false }) as { slug: string };

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSku, setSelectedSku] = useState<number>(1);
  const [selectedAttribute, setSelectedAttribute] = useState<number>(0);

  const {
    addToCart,
    cart,
    setQuantity: setQtyCart,
    clearCart,
  } = useCartStore((state) => state);
  console.log(cart, 'cart');
  const { data: productsDetailsResponse } = useQuery({
    queryKey: ['getProductsDetails', slug],
    queryFn: () => getProductsDetails(slug),
    enabled: !!slug,
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

  useEffect(() => {
    if (productSku) {
      setSelectedAttribute(productSku[0].AttributeOptionId);
      setSelectedSku(productSku[0].Id);
    }
  }, [productSku]);

  const navigate = useNavigate();

  return (
    <section className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3 lg:row-end-1">
              {productImages && <ProductImages Images={productImages} />}
            </div>

            <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
              {productDetails && (
                <div>
                  <h1 className="text-4xl font-normal tracking-wide">
                    {productDetails.Title}
                  </h1>

                  {productSku && (
                    <p className="text-xl font-normal my-3 tracking-wider">
                      {productSku.map((sku) => {
                        if (sku.Id === selectedSku) {
                          return (
                            <div>
                              {sku.ShowCompareAtPrice && (
                                <span className="inline-block mr-3 line-through">
                                  {formatPrice(sku.CompareAtPrice)}
                                </span>
                              )}
                              {formatPrice(sku.Price)}
                              {sku.ShowCompareAtPrice && (
                                <span className="inline-block ml-3 bg-green-500 text-white p-1 text-sm rounded-sm">
                                  {calculateDiscountPercentage(
                                    sku.CompareAtPrice,
                                    sku.Price
                                  ).toFixed(2)}
                                  % off
                                </span>
                              )}
                            </div>
                          );
                        } else {
                          return <></>;
                        }
                      })}
                    </p>
                  )}

                  <div className="my-3">
                    <RichTextRender
                      className="min-h-fit"
                      initialVal={productDetails.Summary}
                    />
                  </div>
                </div>
              )}

              {/* has variant? */}

              {HasVariant &&
                productAttributeName &&
                productAttributeOptions && (
                  <div className="my-3">
                    <span className="block font-light">
                      {productAttributeName?.Name}
                    </span>
                    <div className="my-3">
                      {productAttributeOptions.map((attribute) => (
                        <button
                          className={cn(
                            'bg-white text-gray-800 border border-gray-600 rounded-sm mr-2 p-2 hover:bg-gray-800 hover:text-white ',
                            attribute.Id === selectedAttribute &&
                              '!bg-gray-800 !text-white'
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedAttribute(attribute.Id);
                            productSku?.forEach((sku) => {
                              if (sku.AttributeOptionId === attribute.Id) {
                                setSelectedSku(sku.Id);
                              }
                            });
                          }}
                          key={attribute.Id}
                        >
                          {attribute.Value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              <span className="block mb-2 font-light">Quantity</span>
              <div className="flex">
                <button
                  className="border border-gray-400 py-2 px-5"
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
                  className="border border-gray-400 py-2 px-5"
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
                    if (productDetails && productDetails?.HasVariant) {
                      productSku?.forEach((sku) => {
                        if (sku.Id === selectedSku) {
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
                            Quantity: quantity,
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
                        Quantity: quantity,
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
                        if (sku.Id === selectedSku) {
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
                            Quantity: quantity,
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
                        Quantity: quantity,
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
          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="w-full">
              {productDetails?.Description && (
                <RichTextRender initialVal={productDetails?.Description} />
              )}
            </TabsContent>
            <TabsContent value="reviews">Change your reviews here.</TabsContent>
          </Tabs>
        </div>
      </section>
    </section>
  );
};

export default ProductDetails;
