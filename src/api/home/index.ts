import { queryOptions } from '@tanstack/react-query';
import ApiClient from '@/libs/ApiClient';
import { ListResponseType } from '@/libs/types/responseTypes';

export interface AreaType {
  Id: number;

  Area: string;
  Cost: number;
  CreatedAt: string;
  UpdatedAt: string;
}
export interface HomeSectionsTypes {
  Id: number;

  Title: string;
  Description: string;
  ViewAllLink: any;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface SectionProductsType {
  Id: number;

  ProductId: number;
  SectionId: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Hero {
  Id: number;
  ImageLink: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getHomeSections = async (): Promise<
  ListResponseType<HomeSectionsTypes>
> => {
  const response = await ApiClient.get('/storefront-home/sections');

  return response.data;
};

export const getHomeHero = async (): Promise<ListResponseType<Hero>> => {
  const response = await ApiClient.get('/storefront-hero');

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

// options
export const getHomeSectionsOptions = () =>
  queryOptions({
    queryKey: ['getHomeSections'],
    queryFn: () => getHomeSections(),
  });

export const getHomesectionsProductsOptions = (sectionId: number) =>
  queryOptions({
    queryKey: ['getSectionsProducts', sectionId],
    queryFn: () => getHomesectionsProducts(sectionId),
    enabled: !!sectionId,
  });

export const getHomeHeroOptions = () =>
  queryOptions({
    queryKey: ['getHomeHero'],
    queryFn: () => getHomeHero(),
  });
