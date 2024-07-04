import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router';
import NavBar from '../components/NavBar/NavBar';
import Modals from '@web/components/Modals/Modals';
import Cart from '@web/components/Cart/Cart';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { getTurnstile } from '@web/api/turnstile';
import { useEffect } from 'react';
import { AuthStoreType } from '@web/store/authStore';

const RootComponent: React.FC = () => {
  const { data: turnstileResponse } = useQuery({
    queryKey: ['getTurnstile'],
    queryFn: getTurnstile,
  });

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
