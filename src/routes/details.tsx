import { createFileRoute, redirect } from '@tanstack/react-router';
import Details from '@/pages/details/Details';

export const Route = createFileRoute('/details')({
  beforeLoad: async ({ context, params }) => {
    if (context && !context.hasCookie && !context.auth?.isAuthenticated) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: () => <Details />,
});
