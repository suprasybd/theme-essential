import { queryOptions } from '@tanstack/react-query';
import ApiClient from '@/libs/ApiClient';
import { ListResponseType, ResponseType } from '@/libs/types/responseTypes';

export interface CategoryType {
  Id: number;

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

export const getCategoryId = async (
  categoryName: string
): Promise<ResponseType<CategoryType>> => {
  const response = await ApiClient.get(
    `/storefront-categories/getid/${categoryName}`
  );

  return response.data;
};

// options
export const getCategoriesOptions = () =>
  queryOptions({
    queryFn: () => getCategories(),
    queryKey: ['getCategoriesResponse'],
  });
