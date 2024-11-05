import { AxiosError } from 'axios';
import Cookie from 'js-cookie';
import { useAuthStore } from '../../store/authStore';
import { SITE_URL } from '../../config/api';
import { router } from '../../app';

export const cleanRemoveTokens = () => {
  Cookie.remove('accessToken', { domain: SITE_URL });
  Cookie.remove('userDetails', { domain: SITE_URL });
};

const errorResponseHandler = async (error: AxiosError) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 401) {
      // LOGOUT
      cleanRemoveTokens();
      useAuthStore.getState().logout();
      router.history.push('/');
    }
  }
  return error;
};

export default errorResponseHandler;
