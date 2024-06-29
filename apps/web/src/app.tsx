import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import { routeTree } from './routeTree.gen';

import { Toaster } from '@frontend.suprasy.com/ui';
import PendingComponent from './components/PendingComponent/PendingComponent';

const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: {
    hasCookie: false,
    queryClient,
  },
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
        <Suspense fallback={<PendingComponent hScreen />}>
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
