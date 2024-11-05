import axios, { AxiosError, AxiosResponse } from 'axios';

import { accessTokenHandler } from './api/TokenHandler';
import errorResponseHandler from './api/ResponseHandler';
import { SUPRASY_API_URL, SUPRASY_CF_API } from '../config/api';

const SuprasyApiHost = SUPRASY_API_URL;
const SuprasyCFApiHost = SUPRASY_CF_API;
const ApiClient = axios.create({
  baseURL: SuprasyApiHost,
});

ApiClient.interceptors.request.use((request) => {
  accessTokenHandler(request);
  return request;
});

ApiClient.interceptors.response.use(
  (response: AxiosResponse) => Promise.resolve(response),
  (error: AxiosError) => {
    void errorResponseHandler(error);
    return Promise.reject(error);
  }
);

export default ApiClient;

export const ApiClientCF = axios.create({
  baseURL: SuprasyCFApiHost,
});

ApiClientCF.interceptors.request.use((request) => {
  accessTokenHandler(request);
  return request;
});

ApiClientCF.interceptors.response.use(
  (response: AxiosResponse) => Promise.resolve(response),
  (error: AxiosError) => {
    void errorResponseHandler(error);
    return Promise.reject(error);
  }
);
