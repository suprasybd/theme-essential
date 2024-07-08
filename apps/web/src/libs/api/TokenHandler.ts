import Cookies from 'js-cookie';
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export const accessTokenHandler = (request: AxiosRequestConfig): void => {
  const accessToken = Cookies.get('accessToken') as string;
  const storeKey = 'FD93A6AF0E704F5BAD7F0DBF06611110';
  (request.headers as AxiosRequestHeaders).Authorization = accessToken
    ? `Bearer ${accessToken}`
    : '';
  (request.headers as AxiosRequestHeaders).StoreKey = storeKey || '';
};
