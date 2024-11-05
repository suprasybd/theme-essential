import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/account')({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
});
