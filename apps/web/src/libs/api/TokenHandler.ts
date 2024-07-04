import Cookies from 'js-cookie';
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export const accessTokenHandler = (request: AxiosRequestConfig): void => {
  const accessToken = Cookies.get('accessToken') as string;
  const storeKey = 'CC51B7ED2B14489592498BC654708303';
  (request.headers as AxiosRequestHeaders).Authorization = accessToken
    ? `Bearer ${accessToken}`
    : '';
  (request.headers as AxiosRequestHeaders).StoreKey = storeKey || '';
};
