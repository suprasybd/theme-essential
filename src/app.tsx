import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React, { Suspense, useEffect } from 'react';
import { routeTree } from './routeTree.gen';

import { Toaster } from '@/components/ui/toaster';
import PendingComponent from './components/PendingComponent/PendingComponent';
import FullScreenLoader from './components/Loader/Loader';
import loadCurrentUser from './config/profile/loadUser';
import { useAuthStore } from './store/authStore';
import { hasCookie } from './config/profile/hasCookie';

const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
    hasCookie: false,
    queryClient,
  },
  defaultPendingComponent: undefined,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  const auth = useAuthStore((state) => state);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const hasCookie_ = hasCookie();

  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<FullScreenLoader className="bg-white" />}>
          <RouterProvider
            router={router}
            context={{ auth, hasCookie: hasCookie_ }}
          ></RouterProvider>
        </Suspense>
      </QueryClientProvider>
    </>
  );
};
export default App;
