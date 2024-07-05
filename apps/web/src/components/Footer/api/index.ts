import { queryOptions } from '@tanstack/react-query';
import ApiClient from '@web/libs/ApiClient';
import { ListResponseType, ResponseType } from '@web/libs/types/responseTypes';

export interface FooterType {
  Id: number;
  StoreKey: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface PageType {
  Id: number;
  StoreKey: string;
  Description: string;
  Url: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getFooter = async (): Promise<ResponseType<FooterType>> => {
  const response = await ApiClient.get(`/storefront-footer`);

  return response.data;
};

export const getPages = async (): Promise<ListResponseType<PageType>> => {
  const response = await ApiClient.get(`/storefront-footer/pages`);

  return response.data;
};

export const getPage = async (url: string): Promise<ResponseType<PageType>> => {
  const response = await ApiClient.get(`/storefront-footer/page/${url}`);

  return response.data;
};