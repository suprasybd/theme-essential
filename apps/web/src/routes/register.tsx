import { createFileRoute } from '@tanstack/react-router';
import Register from '@web/pages/account/Register';

export const Route = createFileRoute('/register')({
  component: () => <Register />,
});
