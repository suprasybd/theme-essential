import ApiClient from '@/libs/ApiClient';
import { ListResponseType, ResponseType } from '@/libs/types/responseTypes';
import {
  AttributeName,
  AttributeValue,
  ProductImagesTypes,
  ProductSku,
  ProductType,
  VariationType,
} from './types';
import { queryOptions } from '@tanstack/react-query';

export interface AreaType {
  Id: number;

  Area: string;
  Cost: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getProductsDetails = async (
  slug: string
): Promise<ResponseType<ProductType>> => {
  const response = await ApiClient.get(`/storefront-products/product/${slug}`);

  return response.data;
};

export const getProductsList = async (Queries: {
  [key: string]: any;
  Page?: number;
  Limit?: number;
}): Promise<ListResponseType<ProductType>> => {
  const response = await ApiClient.get('/storefront-products/all', {
    params: Queries,
  });

  return response.data;
};

export const getProductsDetailsById = async (
  id: string
): Promise<ResponseType<ProductType>> => {
  const response = await ApiClient.get(`/storefront-products/product-id/${id}`);

  return response.data;
};

export const getProductImages = async (
  variationId: number
): Promise<ListResponseType<ProductImagesTypes>> => {
  const response = await ApiClient.get(
    `/storefront-products/images/${variationId}`
  );

  return response.data;
};

export const getProductVariations = async (
  productId: number
): Promise<ListResponseType<VariationType>> => {
  const response = await ApiClient.get(
    `/storefront-products/variations/${productId}`
  );

  return response.data;
};

export const getProductVariationDetails = async (
  variationId: number
): Promise<ResponseType<VariationType>> => {
  const response = await ApiClient.get(
    `/storefront-products/variation-id/${variationId}`
  );

  return response.data;
};

// options

export const getProductsDetailsByIdOption = (ProductId: number) =>
  queryOptions({
    queryKey: ['getProductsDetails', ProductId],
    queryFn: () => getProductsDetailsById(ProductId.toString()),
    enabled: !!ProductId,
  });

export const getProductImagesOption = (VariationId: number) =>
  queryOptions({
    queryKey: ['getProductImages', VariationId],
    queryFn: () => getProductImages(VariationId),
    enabled: !!VariationId,
  });
