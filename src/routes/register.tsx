import { createFileRoute, redirect } from '@tanstack/react-router';
import Register from '@/pages/account/Register';

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    if (context && context.hasCookie) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Register />,
});
