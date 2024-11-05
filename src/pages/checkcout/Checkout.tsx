import { formatPrice } from '@/libs/helpers/formatPrice';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
} from '@/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  RadioGroup,
  RadioGroupItem,
  FormMessage,
} from '@/components/ui';
import { Input } from '@/components/ui';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/components/Modals/Cart/Cart';
import {
  getDevliveryMethods,
  getShippingMethods,
  placeOrderPost,
} from '../../api/checkout/index';
import FullScreenLoader from '@/components/Loader/Loader';
import { Link, useParams, useSearch } from '@tanstack/react-router';
import { Turnstile } from '@marsidev/react-turnstile';
import useTurnStileHook from '@/hooks/turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';
import { CheckCircle, Lock } from 'lucide-react';
import { Route as CheckoutRoute } from '@/routes/checkout';
import { encode, decode } from 'js-base64';

import ProductDescription from '../products/details/components/ProductDescription';
import { useAuthStore } from '@/store/authStore';
const orderProducts = z.object({
  VariationId: z.number(),
  Quantity: z.number(),
});

export const formSchemaCheckout = z.object({
  FullName: z.string().min(1).max(50),
  Address: z.string().min(2).max(100),
  Email: z.string().email().min(2).max(100),
  Phone: z.string().min(2).max(100),
  DeliveryMethodId: z.number(),
  ShippingMethodId: z.number(),
  PaymentType: z.string().min(1).max(100).default('cod'),
  Products: z.array(orderProducts).min(1).max(10),
});

const Checkout = () => {
  const { products } = useSearch({
    from: CheckoutRoute.fullPath,
  });
  const { cart, priceMap, clearCart, addToCart } = useCartStore(
    (state) => state
  );
  const { isAuthenticated, user } = useAuthStore((state) => state);

  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<number>(0);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<number>(0);

  const form = useForm<z.infer<typeof formSchemaCheckout>>({
    resolver: zodResolver(formSchemaCheckout),
    defaultValues: {},
  });

  const {
    mutate: handlePlaceOrder,
    isPending,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: placeOrderPost,
    onSuccess: () => {
      clearCart();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error?.response?.data?.Message ||
          error?.response?.data?.message ||
          'Something went wrong. Please try again.',
      });
    },
  });

  // useEffect(() => {
  //   if (!products) return;

  //   const dCoded = JSON.parse(decode(products));

  //   if (products && dCoded) {
  //     clearCart();
  //     dCoded.forEach((prod: { [x: string]: any }) => {
  //       if (
  //         Object.keys(prod).includes('ProductId') &&
  //         Object.keys(prod).includes('Variant')
  //       ) {
  //         if (
  //           typeof prod['ProductId'] === 'number' &&
  //           typeof prod['Variant'] === 'string'
  //         ) {
  //           addToCart({
  //             ProductId: prod['ProductId'],
  //             ProductAttribute: prod['Variant'],
  //             Quantity: 1,
  //           });
  //         }
  //       } else if (Object.keys(prod).includes('ProductId')) {
  //         if (typeof prod['ProductId'] === 'number') {
  //           addToCart({
  //             ProductId: prod['ProductId'],
  //             Quantity: 1,
  //           });
  //         }
  //       }
  //     });
  //     console.log('dcoded', dCoded);
  //   }
  // }, [products]);

  useEffect(() => {
    if (isAuthenticated && user) {
      form.setValue('Email', user.Email);
      form.setValue('FullName', user.FullName);
    }
  }, [isAuthenticated, user, form]);

  const { data: shippingMethodsResponse } = useQuery({
    queryKey: ['getShippingMethods'],
    queryFn: () => getShippingMethods(),
  });

  const { data: deliveryMethodsResponse } = useQuery({
    queryKey: ['getDevliveryMethods'],
    queryFn: () => getDevliveryMethods(),
  });

  const shippingMethods = shippingMethodsResponse?.Data;
  const deliveryMethods = deliveryMethodsResponse?.Data;

  useEffect(() => {
    if (shippingMethods && shippingMethods.length) {
      setSelectedShippingMethod(shippingMethods[0].Id);
    }

    if (deliveryMethods && deliveryMethods.length) {
      setSelectedDeliveryMethod(deliveryMethods[0].Id);
    }
  }, [deliveryMethods, shippingMethods]);

  useEffect(() => {
    if (selectedDeliveryMethod) {
      form.setValue('DeliveryMethodId', selectedDeliveryMethod);
    }

    if (selectedShippingMethod) {
      form.setValue('ShippingMethodId', selectedShippingMethod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeliveryMethod, selectedShippingMethod]);

  useEffect(() => {
    if (cart && cart.length) {
      const cartFormatter = async () => {
        const formatedCart = cart.map(async (cartItem) => {
          return {
            VariationId: cartItem.VariationId,
            Quantity: cartItem.Quantity,
          };
        });

        form.setValue('Products', await Promise.all(formatedCart));
      };

      cartFormatter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  function onSubmit(
    values: z.infer<typeof formSchemaCheckout>,
    turnstileResponse: string | null
  ) {
    handlePlaceOrder({ ...values, 'cf-turnstile-response': turnstileResponse });
  }

  const estimatedTotal = useMemo(() => {
    if (priceMap) {
      let estimateTotal = 0;
      Object.keys(priceMap).forEach((key) => {
        estimateTotal += priceMap[key];
      });
      const deliveryCost =
        deliveryMethods?.find((d) => d.Id === selectedDeliveryMethod)?.Cost ||
        0;
      const shippingCost =
        shippingMethods?.find((d) => d.Id === selectedShippingMethod)?.Cost ||
        0;

      estimateTotal += deliveryCost;
      estimateTotal += shippingCost;
      return estimateTotal;
    } else {
      return 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMap, selectedDeliveryMethod, selectedShippingMethod]);

  const [siteKey, turnstileLoaded, resetTurnstile] = useTurnStileHook();

  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;
      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof formSchemaCheckout>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      resetTurnstile();
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
        <div className="flex justify-center items-center w-full h-[80vh]">
          <div className="text-center max-w-lg">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <h1 className="text-4xl font-medium mb-4">
              Thank you for your order!
            </h1>
            <p className="text-gray-600 mb-6">
              Your order has been successfully placed. We've sent a confirmation
              email to your inbox with all the order details. Please check your
              email for further instructions.
            </p>
            <div className="space-y-4">
              <Link to="/details">
                <Button variant="outline" className="w-full py-6">
                  View Order Details
                </Button>
              </Link>
              <Link to="/" className="mt-3">
                <Button className="w-full py-6">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <div className="grid md:grid-cols-[1fr,400px] gap-8">
        {/* Form Section */}
        <Form {...form}>
          <form onSubmit={handleFormWrapper} className="space-y-8">
            {/* Delivery Details Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-semibold mb-6">Delivery Details</h1>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="FullName"
                  render={({ field }) => (
                    <FormItem className="!my-[10px] w-full">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          className="py-6"
                          FormError={!!form.formState.errors.FullName}
                          placeholder="Full name"
                          readOnly={isAuthenticated && !!user?.FullName}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Email"
                  render={({ field }) => (
                    <FormItem className="!my-[10px]">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="py-6"
                          FormError={!!form.formState.errors.Email}
                          placeholder="Email"
                          readOnly={isAuthenticated && !!user?.Email}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Phone"
                  render={({ field }) => (
                    <FormItem className="!my-[10px]">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          className="py-6"
                          FormError={!!form.formState.errors.Phone}
                          placeholder="Phone"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Address"
                  render={({ field }) => (
                    <FormItem className="!my-[10px]">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          className="py-7"
                          FormError={!!form.formState.errors.Address}
                          placeholder="Address eg. - Area, Mirpur, Road Number , House Number"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Shipping Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">Shipping Area</h2>
              {shippingMethods && shippingMethods.length && (
                <RadioGroup
                  onValueChange={(val) =>
                    setSelectedShippingMethod(parseInt(val))
                  }
                  defaultValue={shippingMethods[0].Id.toString()}
                  className="space-y-3"
                >
                  {shippingMethods.map((method) => (
                    <Label
                      key={method.Id}
                      htmlFor={method.Id.toString()}
                      className="relative flex p-4 cursor-pointer rounded-lg border border-gray-200 hover:border-primary transition-colors"
                    >
                      <div className="flex items-start gap-4 w-full">
                        <RadioGroupItem
                          value={method.Id.toString()}
                          id={method.Id.toString()}
                        />
                        <div className="flex justify-between w-full">
                          <div>
                            <h3 className="font-medium">{method.Area}</h3>
                            <p className="text-sm text-gray-500">
                              Estimated delivery: 2-3 days
                            </p>
                          </div>
                          <div className="text-right">
                            {method.Cost === 0 ? (
                              <span className="font-medium text-green-600">
                                Free
                              </span>
                            ) : (
                              <span className="font-medium">
                                {formatPrice(method.Cost)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            </div>

            {/* Delivery Method Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">Delivery Method</h2>
              {deliveryMethods && deliveryMethods.length && (
                <RadioGroup
                  onValueChange={(val) => {
                    setSelectedDeliveryMethod(
                      parseInt(val.replace(/delivery/g, ''))
                    );
                  }}
                  defaultValue={`${deliveryMethods[0].Id.toString()}delivery`}
                  className="space-y-3"
                >
                  {deliveryMethods.map((method) => (
                    <Label
                      key={method.Id}
                      htmlFor={`${method.Id.toString()}delivery`}
                      className="relative flex p-4 cursor-pointer rounded-lg border border-gray-200 hover:border-primary transition-colors"
                    >
                      <div className="flex items-start gap-4 w-full">
                        <RadioGroupItem
                          value={`${method.Id.toString()}delivery`}
                          id={`${method.Id.toString()}delivery`}
                        />
                        <div className="flex justify-between w-full">
                          <div>
                            <h3 className="font-medium">
                              {method.DeliveryMethod}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Standard delivery service
                            </p>
                          </div>
                          <div className="text-right">
                            {method.Cost === 0 ? (
                              <span className="font-medium text-green-600">
                                Free
                              </span>
                            ) : (
                              <span className="font-medium">
                                {formatPrice(method.Cost)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
              <RadioGroup defaultValue="payment-cod" className="space-y-3">
                <Label
                  htmlFor="payment-cod"
                  className="relative flex p-4 cursor-pointer rounded-lg border border-gray-200 hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value="payment-cod" id="payment-cod" />
                    <div>
                      <h3 className="font-medium">Cash on Delivery</h3>
                      <p className="text-sm text-gray-500">
                        Pay when you receive
                      </p>
                    </div>
                  </div>
                </Label>
              </RadioGroup>

              {/* Add Turnstile and Place Order Button */}
              <div className="mt-6 space-y-4">
                {siteKey && (
                  <Turnstile options={{ size: 'auto' }} siteKey={siteKey} />
                )}

                <Button
                  type="submit"
                  className="w-full py-6 text-lg font-medium"
                  disabled={!turnstileLoaded || isPending}
                  variant="default"
                >
                  {!turnstileLoaded && (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  )}
                  {turnstileLoaded && (
                    <>
                      {isPending ? (
                        <>
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Place Order
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>

        {/* Order Summary Card - Fixed on desktop */}
        <div className="md:sticky md:top-24 h-fit">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {cart?.length} {cart?.length === 1 ? 'item' : 'items'} in cart
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {cart?.map((cartItem) => (
                  <CartItem key={cartItem.VariationId} Cart={cartItem} />
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t p-6">
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(estimatedTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {formatPrice(
                      shippingMethods?.find(
                        (s) => s.Id === selectedShippingMethod
                      )?.Cost || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span>
                    {formatPrice(
                      deliveryMethods?.find(
                        (s) => s.Id === selectedDeliveryMethod
                      )?.Cost || 0
                    )}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(estimatedTotal)}</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;