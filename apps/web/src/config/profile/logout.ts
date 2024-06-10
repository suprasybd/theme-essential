import { router } from '../../app';
import { cleanRemoveTokens } from '../../libs/api/ResponseHandler';
import { useAuthStore } from '../../store/authStore';

export const logoutUser = () => {
  useAuthStore.getState().logout();
  cleanRemoveTokens();
  router.history.push('/login');
};
