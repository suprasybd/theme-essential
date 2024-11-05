import ApiClient from '@/libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
  SingleResposeType,
} from '@/libs/types/responseTypes';
import { loginSchema } from '../../pages/account/Login';
import { z } from 'zod';
import Cookie from 'js-cookie';
import { SITE_URL } from '@/config/api';
import { useAuthStore } from '@/store/authStore';
import { registerSchema } from '../../pages/account/Register';

export const login = async (
  data: z.infer<typeof loginSchema>
): Promise<SingleResposeType> => {
  const response = await ApiClient.post('/storefront-auth/login', data);

  const accessToken = response.data?.Token;
  const userDetails = JSON.stringify(response.data?.Data);
  const user = response.data?.Data;
  if (accessToken) {
    Cookie.set('accessToken', accessToken as string, {
      domain: SITE_URL,
      path: '/',
    });
  }
  if (userDetails) {
    Cookie.set('userDetails', userDetails, {
      domain: SITE_URL,
      path: '/',
    });
  }
  if (user && accessToken) {
    useAuthStore.getState().login(user);
  }
  return response.data;
};

export const register = async (
  data: z.infer<typeof registerSchema>
): Promise<SingleResposeType> => {
  const response = await ApiClient.post('/storefront-auth/register', data);

  return response.data;
};
