import { createFileRoute } from '@tanstack/react-router';
import Login from '@web/pages/account/Login';

export const Route = createFileRoute('/login')({
  component: () => <Login />,
});
