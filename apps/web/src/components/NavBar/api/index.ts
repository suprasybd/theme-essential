import { queryOptions } from '@tanstack/react-query';
import ApiClient from '@web/libs/ApiClient';
import { ListResponseType } from '@web/libs/types/responseTypes';

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

export const getSubCategories = async (
  parentId: number
): Promise<ListResponseType<CategoryType>> => {
  const response = await ApiClient.get(
    `/storefront-categories/all/${parentId}`
  );

  return response.data;
};

// options
export const getCategoriesOptions = () =>
  queryOptions({
    queryFn: () => getCategories(),
    queryKey: ['getCategoriesResponse'],
  });
