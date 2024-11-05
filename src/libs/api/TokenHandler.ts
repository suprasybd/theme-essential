import Cookies from 'js-cookie';
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { STORE_KEY } from '@/config/storeKey';

export const accessTokenHandler = (request: AxiosRequestConfig): void => {
  const accessToken = Cookies.get('accessToken') as string;
  const storeKey = STORE_KEY;
  (request.headers as AxiosRequestHeaders).Authorization = accessToken
    ? `Bearer ${accessToken}`
    : '';
  (request.headers as AxiosRequestHeaders).StoreKey = storeKey || '';
};
