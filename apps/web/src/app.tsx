import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import { routeTree } from './routeTree.gen';

import { Toaster } from '@frontend.suprasy.com/ui';

export const router = createRouter({
  routeTree,
  context: {
    hasCookie: false,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={router}
          context={{ hasCookie: false }}
        ></RouterProvider>
      </QueryClientProvider>
    </>
  );
};
export default App;
