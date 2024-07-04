import Cookies from 'js-cookie';
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export const accessTokenHandler = (request: AxiosRequestConfig): void => {
  const accessToken = Cookies.get('accessToken') as string;
  const storeKey = '17ED9ECD618343F899F2115965F28F1B';
  (request.headers as AxiosRequestHeaders).Authorization = accessToken
    ? `Bearer ${accessToken}`
    : '';
  (request.headers as AxiosRequestHeaders).StoreKey = storeKey || '';
};
