import ApiClient from '@/libs/ApiClient';
import { ListResponseType, ResponseType } from '@/libs/types/responseTypes';

export interface AreaType {
  Id: number;

  Area: string;
  Cost: number;
  Description: string | null;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface DeliveryType {
  Id: number;

  DeliveryMethod: string;
  Cost: number;
  Description: string | null;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface PaymentMethodType {
  Id: number;
  PaymentMethod: string;
  Description: string | null;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getShippingMethods = async (): Promise<
  ListResponseType<AreaType>
> => {
  const response = await ApiClient.get(`/storefront-order/shipping-zones`);

  return response.data;
};

export const getDevliveryMethods = async (): Promise<
  ListResponseType<DeliveryType>
> => {
  const response = await ApiClient.get(`/storefront-order/delivery-method`);

  return response.data;
};

export const getPaymentMethods = async (): Promise<
  ListResponseType<PaymentMethodType>
> => {
  const response = await ApiClient.get(`/storefront-order/payment-methods`);
  return response.data;
};

export const placeOrderPost = async (
  data: any
): Promise<ResponseType<{ Password?: string }>> => {
  const response = await ApiClient.post('/storefront-order/place-order', data);

  return response.data;
};

export interface CheckUserResponse {
  Success: boolean;
  Data: {
    canPurchase: boolean;
  };
  Message: string;
}

export const checkUserExists = async (
  email: string
): Promise<CheckUserResponse> => {
  const response = await ApiClient.get(`/storefront-order/check-user/${email}`);
  return response.data;
};
