import ApiClient from '@web/libs/ApiClient';
import { ListResponseType, ResponseType } from '@web/libs/types/responseTypes';
import { z } from 'zod';

export interface CategoryType {
  Id: number;
  StoreKey: string;
  ParentCategoryId?: number;
  Name: string;
  Icon?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getCategories = async (): Promise<
  ListResponseType<CategoryType>
> => {
  const response = await ApiClient.get(`/storefront-categories/all`);

  return response.data;
};
