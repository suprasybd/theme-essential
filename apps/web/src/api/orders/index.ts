import ApiClient from '@web/libs/ApiClient';
import { ListResponseType } from '@web/libs/types/responseTypes';

export interface OrdersType {
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

export const getOrders = async (): Promise<ListResponseType<OrdersType>> => {
  const response = await ApiClient.get(`/storefront-order/orders`);

  return response.data;
};
