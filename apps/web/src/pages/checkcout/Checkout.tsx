import { formatPrice } from '@web/libs/helpers/formatPrice';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  getProductAttributeName,
  getProductAttributeOptions,
  getProductImages,
  getProductSku,
  getProductsDetailsById,
} from '../products/api';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Label } from '@frontend.suprasy.com/ui';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  RadioGroup,
  RadioGroupItem,
  FormMessage,
} from '@frontend.suprasy.com/ui';
import { Input } from '@frontend.suprasy.com/ui';

import { useMutation, useQuery } from '@tanstack/react-query';
import { ProductCartType, useCartStore } from '@web/store/cartStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@frontend.suprasy.com/ui';
import { CartItem } from '@web/components/Modals/Cart/Cart';
import { getDevliveryMethods, getShippingMethods, placeOrderPost } from './api';
import FullScreenLoader from '@web/components/Loader/Loader';
import { Link } from '@tanstack/react-router';

const orderProducts = z.object({
  ProductId: z.number(),
  Quantity: z.number(),
  AttributeOptionsId: z.number().optional(),
});

export const formSchemaCheckout = z.object({
  FirstName: z.string().min(1).max(50),
  LastName: z.string().min(1).max(50),
  Address: z.string().min(2).max(100),
  Email: z.string().email().min(2).max(100),
  Phone: z.string().min(2).max(100),
  DeliveryMethodId: z.number(),
  ShippingMethodId: z.number(),
  PaymentType: z.string().min(1).max(100).default('cod'),
  Products: z.array(orderProducts).min(1).max(10),
});

const Checkout = () => {
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
      const formatedCart = cart.map((cartItem) => {
        if (cartItem.ProductAttribute) {
          return {
            ProductId: cartItem.ProductId,
            Quantity: cartItem.Quantity,
            AttributeOptionsId: cartItem.ProductAttribute,
          };
        } else {
          return {
            ProductId: cartItem.ProductId,
            Quantity: cartItem.Quantity,
          };
        }
      });

      form.setValue('Products', formatedCart);
    }
  }, [cart]);

  function onSubmit(values: z.infer<typeof formSchemaCheckout>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    handlePlaceOrder(values);
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

      <Accordion type="single" defaultValue="item-1" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-3xl font-medium tracking-wider">
            <div className="flex justify-between w-full">
              <h2>Order Summary</h2>
              <h2>{formatPrice(estimatedTotal)}</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>
              <h1>Your Order Summary</h1>
              <div className="my-3">
                {cart && cart.map((cartItem) => <CartItem Cart={cartItem} />)}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* devliary form */}

      <div className="my-5">
        <h1 className="text-2xl font-medium mb-3">Devilery</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex w-full gap-[10px]">
              <FormField
                control={form.control}
                name="FirstName"
                render={({ field }) => (
                  <FormItem className="!my-[10px] w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        className="py-6"
                        FormError={!!form.formState.errors.FirstName}
                        placeholder="First name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="LastName"
                render={({ field }) => (
                  <FormItem className="!my-[10px] w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        className="py-6"
                        FormError={!!form.formState.errors.LastName}
                        placeholder="Last name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                          {method.Cost !== 0 && <>{formatPrice(method.Cost)}</>}
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
                          {method.Cost !== 0 && <>{formatPrice(method.Cost)}</>}
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

            <Button type="submit" className="w-full">
              Place Order
            </Button>
          </form>
        </Form>
        {isPending && <FullScreenLoader />}
      </div>
    </div>
  );
};

export default Checkout;
