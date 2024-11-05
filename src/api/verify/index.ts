import ApiClient from '@/libs/ApiClient';
import { ResponseType } from '@/libs/types/responseTypes';

export const verifyEmailCode = async (
  code: string
): Promise<ResponseType<string>> => {
  const response = await ApiClient.get(`/storefront-auth/verify/${code}`);

  return response.data;
};
