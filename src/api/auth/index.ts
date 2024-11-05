import ApiClient from '@/libs/ApiClient';

export const requestPasswordReset = async (data: {
  email: string;
  'cf-turnstile-response': string;
}) => {
  const response = await ApiClient.post(
    `/storefront-auth/passwordreset/${data.email}`,
    { 'cf-turnstile-response': data['cf-turnstile-response'] }
  );
  return response.data;
};

export const resetPassword = async (data: {
  Code: string;
  Password: string;
  'cf-turnstile-response': string;
}) => {
  const response = await ApiClient.post('/storefront-auth/passwordreset', data);
  return response.data;
};
