import ApiClient from '@web/libs/ApiClient';
import { ListResponseType, ResponseType } from '@web/libs/types/responseTypes';
import {
  AttributeName,
  AttributeValue,
  ProductImagesTypes,
  ProductSku,
  ProductType,
} from './types';
import { queryOptions } from '@tanstack/react-query';

export interface AreaType {
  Id: number;
  StoreKey: string;
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
  productId: number
): Promise<ListResponseType<ProductImagesTypes>> => {
  const response = await ApiClient.get(
    `/storefront-products/images/${productId}`
  );

  return response.data;
};

export const getProductSku = async (
  productId: number
): Promise<ListResponseType<ProductSku>> => {
  const response = await ApiClient.get(`/storefront-products/sku/${productId}`);

  return response.data;
};

export const getProductAttributeOptions = async (
  productId: number
): Promise<ListResponseType<AttributeValue>> => {
  const response = await ApiClient.get(
    `/storefront-products/attribute/${productId}`
  );

  return response.data;
};

export const getProductAttributeName = async (
  productId: number
): Promise<ResponseType<AttributeName>> => {
  const response = await ApiClient.get(
    `/storefront-products/attributeName/${productId}`
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

export const getProductImagesOption = (ProductId: number) =>
  queryOptions({
    queryKey: ['getProductImages', ProductId],
    queryFn: () => getProductImages(ProductId || 0),
    enabled: !!ProductId,
  });

export const getProductSkuOption = (ProductId: number) =>
  queryOptions({
    queryKey: ['getProductSku', ProductId],
    queryFn: () => getProductSku(ProductId || 0),
    enabled: !!ProductId,
  });

// bellow - only run on HasVariant
export const getProductAttributeNameOption = (ProductId: number) =>
  queryOptions({
    queryKey: ['getProductAttributeName', ProductId],
    queryFn: () => getProductAttributeName(ProductId || 0),
    enabled: !!ProductId,
  });
