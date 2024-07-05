import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router';
import NavBar from '../components/NavBar/NavBar';
import Modals from '@web/components/Modals/Modals';
import Cart from '@web/components/Cart/Cart';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { getLogo, getTurnstile } from '@web/api/turnstile';
import { useEffect } from 'react';
import { AuthStoreType } from '@web/store/authStore';
import Footer from '@web/components/Footer/Footer';

const RootComponent: React.FC = () => {
  const { data: turnstileResponse } = useQuery({
    queryKey: ['getTurnstile'],
    queryFn: getTurnstile,
  });

  const { data: logoResposne } = useQuery({
    queryKey: ['getLogo'],
    queryFn: getLogo,
  });

  const logo = logoResposne?.Data;

  const injectFavicon = (url: string) => {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = url;

    const head = document.querySelector('head');

    head?.appendChild(favicon);
  };

  useEffect(() => {
    if (logo?.FaviconLink) {
      injectFavicon(logo.FaviconLink);
    }
  }, [logo]);

  const turnstileData = turnstileResponse?.Data;

  useEffect(() => {
    if (turnstileData && turnstileData.TurnstileKey) {
      localStorage.setItem('turnstile-site-key', turnstileData.TurnstileKey);
    }
  }, [turnstileData]);

  return (
    <>
      <header className="w-full max-w-[1220px] h-fit mx-auto gap-6 py-6 px-4 sm:px-8 ">
        <NavBar />
      </header>
      <Cart />
      <Modals />
      <ScrollRestoration />
      <Outlet />
      {/* footer */}

      <Footer />

      {/* <TanStackRouterDevtools /> */}
    </>
  );
};
interface MyRouterContext {
  hasCookie: boolean;
  auth: AuthStoreType | undefined;
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <RootComponent />,
});
