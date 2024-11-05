import Cookie from 'js-cookie';

export const hasCookie = () => {
  try {
    const accessToken = Cookie.get('accessToken') as string;
    const userDetails = JSON.parse(
      (Cookie.get('userDetails') as string) || '{}'
    );

    if (accessToken && userDetails) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
