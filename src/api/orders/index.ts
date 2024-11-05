import ApiClient from '@/libs/ApiClient';
import { ListResponseType } from '@/libs/types/responseTypes';

export interface OrdersProductType {
  Id: number;
  StoreKey: string;
  UserId: number;
  OrderId: number;
  VariationId: number;
  Price: number;
  Quantity: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface OrderType {
  Id: number;
  OrderMethod: string;
  UserId: number;
  FullName: string;
  Address: string;
  Phone: string;
  Email: string;
  DeliveryMethod: string;
  DeliveryMethodPrice: number;
  ShippingMethod: string;
  ShippingMethodPrice: number;
  PaymentType: string;
  Status: string;
  CreatedAt: string;
  Note: string;
  UpdatedAt: string;
}

interface OrdersQueryParams {
  Page?: number;
  Limit?: number;
}

export const getOrders = async (
  params?: OrdersQueryParams
): Promise<ListResponseType<OrderType>> => {
  const response = await ApiClient.get('/storefront-order/orders', {
    params,
  });

  return response.data;
};

export const getOrderProducts = async (
  orderId: number
): Promise<ListResponseType<OrdersProductType>> => {
  const response = await ApiClient.get(`/storefront-order/${orderId}/products`);
  return response.data;
};
