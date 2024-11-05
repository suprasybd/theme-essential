import ApiClient from '@/libs/ApiClient';
import { ResponseType } from '@/libs/types/responseTypes';

export interface TurnstileType {
  Id: number;
  TurnstileKey: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface LogoType {
  Id: number;

  LogoLink: string;
  FaviconLink: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StoreType {
  Id: number;

  StoreName: string;
  StoreCloudName: string;
  IsActive: boolean;
  DomainName: string;
  UserId: number;
  CreatedAt: string;
  Status: string;
  UpdatedAt: string;
}

export const getTurnstile = async (): Promise<ResponseType<TurnstileType>> => {
  const response = await ApiClient.get(`storefront-turnstile`);

  return response.data;
};

export const getLogo = async (): Promise<ResponseType<LogoType>> => {
  const response = await ApiClient.get(`storefront-logo`);

  return response.data;
};

export const getStore = async (): Promise<ResponseType<StoreType>> => {
  const response = await ApiClient.get(`storefront-logo/store`);

  return response.data;
};
