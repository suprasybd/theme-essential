import Cookie from 'js-cookie';
import { useAuthStore } from '../../store/authStore';

const loadCurrentUser = async () => {
  try {
    const accessToken = Cookie.get('accessToken') as string;
    const userDetails = JSON.parse(
      (Cookie.get('userDetails') as string) || '{}'
    );

    if (accessToken && userDetails) {
      useAuthStore.getState().login(userDetails);
    }
  } catch (error) {
    useAuthStore.getState().logout();
  }
};

export default loadCurrentUser;
