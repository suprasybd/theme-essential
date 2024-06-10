import ApiClient from '@web/libs/ApiClient';
import { ListResponseType, ResponseType } from '@web/libs/types/responseTypes';

export interface AreaType {
  Id: number;
  StoreKey: string;
  Area: string;
  Cost: number;
  CreatedAt: string;
  UpdatedAt: string;
}
export interface HomeSectionsTypes {
  Id: number;
  StoreKey: string;
  Title: string;
  Description: string;
  ViewAllLink: any;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface SectionProductsType {
  Id: number;
  StoreKey: string;
  ProductId: number;
  SectionId: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getHomeSections = async (): Promise<
  ListResponseType<HomeSectionsTypes>
> => {
  const response = await ApiClient.get('/storefront-home/sections');

  return response.data;
};

export const getHomesectionsProducts = async (
  sectionId: number
): Promise<ListResponseType<SectionProductsType>> => {
  const response = await ApiClient.get(
    '/storefront-home/sectionproducts/' + sectionId
  );

  return response.data;
};
