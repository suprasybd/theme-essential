import { createFileRoute, redirect } from '@tanstack/react-router';
import Login from '@/pages/account/Login';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context && context.hasCookie) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Login />,
});
