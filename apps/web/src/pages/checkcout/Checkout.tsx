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
import { getDevliveryMethods, getShippingMethods, placeOrderPost } from './api';
import FullScreenLoader from '@web/components/Loader/Loader';
import { Link, useParams, useSearch } from '@tanstack/react-router';
import { Turnstile } from '@marsidev/react-turnstile';
import useTurnStileHook from '@web/hooks/turnstile';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Lock } from 'lucide-react';
import { Route as CheckoutRoute } from '@web/routes/checkout';
import { encode, decode } from 'js-base64';
import { getProductAttributeOptions } from '../products/api';
const orderProducts = z.object({
  ProductId: z.number(),
  Quantity: z.number(),
  AttributeOptionsId: z.number().optional(),
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
  const { cart, priceMap, clearCart } = useCartStore((state) => state);

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

  console.log('products', products);

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
  }, [selectedDeliveryMethod, selectedShippingMethod]);

  useEffect(() => {
    if (cart && cart.length) {
      const cartFormatter = async () => {
        const formatedCart = cart.map(async (cartItem) => {
          if (cartItem.ProductAttribute) {
            const optionsResponse = await getProductAttributeOptions(
              cartItem.ProductId
            );
            const options = optionsResponse.Data;

            if (options && options.length > 0) {
              const attr = options.find(
                (o) => o.Value === cartItem.ProductAttribute
              );
              return {
                ProductId: cartItem.ProductId,
                Quantity: cartItem.Quantity,
                AttributeOptionsId: attr?.Id as number,
              };
            }
          } else {
            return {
              ProductId: cartItem.ProductId,
              Quantity: cartItem.Quantity,
            };
          }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form.setValue('Products', (await Promise.all(formatedCart)) as any);
        // console.log('formated cart', await Promise.all(formatedCart));
      };

      cartFormatter();
    }
  }, [cart]);

  function onSubmit(values: z.infer<typeof formSchemaCheckout>) {
    const turnstileResponse = localStorage.getItem('cf-turnstile-in-storage');

    handlePlaceOrder({ ...values, 'cf-turnstile-response': turnstileResponse });
  }

  const estimatedTotal = useMemo(() => {
    if (priceMap) {
      let estimateTotal = 0;
      Object.keys(priceMap).forEach((key) => {
        estimateTotal += priceMap[key];
      });
      return estimateTotal;
    } else {
      return 0;
    }
  }, [priceMap]);

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

      localStorage.setItem('cf-turnstile-in-storage', tRes);
      console.log('Hi', form.getValues('Products'));
      form.handleSubmit(onSubmit)(e);
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
                        placeholder="Address Example - Dhaka, Mirpur 10, Road #2 , House 29"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <h1 className="text-2xl font-medium mb-3">Shipping Method</h1>
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
                        <div className="flex w-full justify-between">
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

              {siteKey && <Turnstile siteKey={siteKey} />}

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
            <CardDescription>Card Description</CardDescription>
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
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
