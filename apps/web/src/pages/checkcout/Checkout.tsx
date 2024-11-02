import { formatPrice } from '@web/libs/helpers/formatPrice';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
} from '@frontend.suprasy.com/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  RadioGroup,
  RadioGroupItem,
  FormMessage,
} from '@frontend.suprasy.com/ui';
import { Input } from '@frontend.suprasy.com/ui';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useCartStore } from '@web/store/cartStore';
import { CartItem } from '@web/components/Modals/Cart/Cart';
import {
  getDevliveryMethods,
  getShippingMethods,
  placeOrderPost,
} from '../../api/checkout/index';
import FullScreenLoader from '@web/components/Loader/Loader';
import { Link, useParams, useSearch } from '@tanstack/react-router';
import { Turnstile } from '@marsidev/react-turnstile';
import useTurnStileHook from '@web/hooks/turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Lock } from 'lucide-react';
import { Route as CheckoutRoute } from '@web/routes/checkout';
import { encode, decode } from 'js-base64';

import ProductDescription from '../products/details/components/ProductDescription';
import { useAuthStore } from '@web/store/authStore';
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

  const [siteKey, turnstileLoaded] = useTurnStileHook();

  const forceUpdate = () => {
    window.location.reload();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormWrapper = (e: any) => {
    e.preventDefault();
    try {
      const tRes = e.target['cf-turnstile-response'].value;

      if (!tRes) return;

      form.handleSubmit((values: z.infer<typeof formSchemaCheckout>) =>
        onSubmit(values, tRes)
      )(e);
    } catch (error) {
      forceUpdate();
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
        <div className="flex justify-center items-center w-full h-[80vh]">
          <div>
            <h1 className="text-4xl font-medium">
              Your order has been placed!
            </h1>
            {data?.Data?.Password && (
              <div className="text-center mt-5">
                Your generated account is bellow:
                <p>Email: {form.getValues('Email')}</p>
                <p>Password: {data.Data.Password}</p>
              </div>
            )}
            <Link to="/">
              <Button className="w-full my-10">Continute Shoping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      {/* order summary */}

      <div className="md:flex w-full justify-between gap-[70px]">
        {/* devliary form */}

        <div className="my-5 w-full">
          <h1 className="text-2xl font-medium mb-3">Devilery</h1>

          <Form {...form}>
            <form onSubmit={handleFormWrapper} className="space-y-8">
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
              <h1 className="text-2xl font-medium mb-3">Shipping Charge</h1>
              {shippingMethods && shippingMethods.length && (
                <RadioGroup
                  onValueChange={(val) => {
                    setSelectedShippingMethod(parseInt(val));
                  }}
                  defaultValue={shippingMethods[0].Id.toString()}
                  className="border border-gray-200 rounded-md w-full  block"
                >
                  {shippingMethods.map((method) => (
                    <Label
                      htmlFor={method.Id.toString()}
                      className="p-3 rounded-md py-5 w-full !my-0 block  bg-white  hover:cursor-pointer border-b border-gray-200"
                    >
                      <div className="flex gap-[7px]">
                        <RadioGroupItem
                          className=" !my-0 "
                          value={method.Id.toString()}
                          id={method.Id.toString()}
                        />
                        <div className="flex w-full justify-between items-center">
                          <h3>{method.Area}</h3>
                          <p>
                            {method.Cost !== 0 && (
                              <>{formatPrice(method.Cost)}</>
                            )}
                            {method.Cost === 0 && 'Free'}
                          </p>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}

              <h1 className="text-2xl font-medium mb-3">Delivery Method</h1>
              {deliveryMethods && deliveryMethods.length && (
                <RadioGroup
                  onValueChange={(val) => {
                    setSelectedDeliveryMethod(
                      parseInt(val.replace(/delivery/g, ''))
                    );
                  }}
                  defaultValue={`${deliveryMethods[0].Id.toString()}delivery`}
                  className="border border-gray-200 rounded-md w-full block"
                >
                  {deliveryMethods.map((method) => (
                    <Label
                      htmlFor={`${method.Id.toString()}delivery`}
                      className="p-3 rounded-md py-5 w-full !my-0 block   bg-white  hover:cursor-pointer border-b border-gray-200"
                    >
                      <div className="flex gap-[7px]">
                        <RadioGroupItem
                          className=" !my-0 "
                          value={`${method.Id.toString()}delivery`}
                          id={`${method.Id.toString()}delivery`}
                        />
                        <div className="flex w-full justify-between">
                          <h3 className="tracking-wide !leading-5">
                            {method.DeliveryMethod}
                          </h3>
                          <p>
                            {method.Cost !== 0 && (
                              <>{formatPrice(method.Cost)}</>
                            )}
                            {method.Cost === 0 && 'Free'}
                          </p>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}

              <h1 className="text-2xl font-medium mb-3">Payment</h1>
              {deliveryMethods && deliveryMethods.length && (
                <RadioGroup
                  defaultValue={'payment-cod'}
                  className="border border-gray-200 rounded-md w-full block"
                >
                  <Label
                    htmlFor={`payment-cod`}
                    className="p-3 rounded-md py-5 w-full !my-0 block   bg-white  hover:cursor-pointer border-b border-gray-200"
                  >
                    <div className="flex gap-[7px]">
                      <RadioGroupItem
                        className=" !my-0 "
                        value={`payment-cod`}
                        id={`payment-cod`}
                      />
                      <div className="flex w-full justify-between">
                        <h3 className="tracking-wide !leading-5">
                          Cash On Delivery
                        </h3>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              )}

              {siteKey && (
                <Turnstile options={{ size: 'auto' }} siteKey={siteKey} />
              )}

              <Button
                type="submit"
                className="w-full h-14 bg-[#1773b0]"
                disabled={!turnstileLoaded}
              >
                {!turnstileLoaded && (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    wait a few moment..
                  </>
                )}
                {turnstileLoaded && (
                  <div className="flex justify-center items-center gap-[10px] font-bold ">
                    <span className="text-xl">Place Order</span>
                    <Lock />
                  </div>
                )}
              </Button>
            </form>
          </Form>
          {isPending && <FullScreenLoader />}
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              {' '}
              <div className="flex justify-between w-full">
                <h2>Order Summary</h2>
                <h2>{formatPrice(estimatedTotal)}</h2>
              </div>
            </CardTitle>
            <CardDescription>Check the order summary bellow</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <h1>Your Order Summary</h1>
              <div className="my-3">
                {cart && cart.map((cartItem) => <CartItem Cart={cartItem} />)}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <h1 className="text-xl my-3">Order Summary</h1>
              <p className="flex w-full justify-between">
                <span className="block"> Shipping Charge: </span>

                {shippingMethods?.find((s) => s.Id === selectedShippingMethod)
                  ?.Cost !== 0 && (
                  <span className="font-bold">
                    {formatPrice(
                      shippingMethods?.find(
                        (s) => s.Id === selectedShippingMethod
                      )?.Cost || 0
                    )}
                  </span>
                )}
                {shippingMethods?.find((s) => s.Id === selectedShippingMethod)
                  ?.Cost === 0 && <span className="font-bold">Free</span>}
              </p>

              <p className="my-2 flex w-full justify-between">
                <span className="block">Delivery Charge: </span>

                {deliveryMethods?.find((s) => s.Id === selectedDeliveryMethod)
                  ?.Cost !== 0 && (
                  <span className="font-bold">
                    {formatPrice(
                      deliveryMethods?.find(
                        (s) => s.Id === selectedDeliveryMethod
                      )?.Cost || 0
                    )}
                  </span>
                )}
                {deliveryMethods?.find((s) => s.Id === selectedDeliveryMethod)
                  ?.Cost === 0 && <span className="font-bold">Free</span>}
              </p>
              <p className="flex w-full justify-between">
                <span className="block">Total Cost: </span>

                <span className="font-bold block">
                  {formatPrice(estimatedTotal)}
                </span>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>

      {products && (
        <div className="my-10">
          <h1 className="font-bold text-3xl">Description</h1>

          {cart.map((c) => (
            <ProductDescription ProductId={c.ProductId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Checkout;
