import ApiClient from '@web/libs/ApiClient';
import { ListResponseType } from '@web/libs/types/responseTypes';

export interface OrdersType {
  Id: number;
  Area: string;
  Cost: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getOrders = async (): Promise<ListResponseType<OrdersType>> => {
  const response = await ApiClient.get(`/storefront-order/orders`);

  return response.data;
};
