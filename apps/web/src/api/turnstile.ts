import ApiClient from '@web/libs/ApiClient';
import { ResponseType } from '@web/libs/types/responseTypes';

export interface TurnstileType {
  Id: number;
  TurnstileKey: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface LogoType {
  Id: number;
  StoreKey: string;
  LogoLink: string;
  FaviconLink: string;
  CreatedAt: string;
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
