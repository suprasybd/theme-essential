import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import { routeTree } from './routeTree.gen';

import { Toaster } from '@frontend.suprasy.com/ui';
import PendingComponent from './components/PendingComponent/PendingComponent';
import FullScreenLoader from './components/Loader/Loader';

const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: {
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
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<FullScreenLoader className="bg-white" />}>
          <RouterProvider
            router={router}
            context={{ hasCookie: false }}
          ></RouterProvider>
        </Suspense>
      </QueryClientProvider>
    </>
  );
};
export default App;
