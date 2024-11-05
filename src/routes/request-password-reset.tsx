import { createFileRoute } from '@tanstack/react-router';
import RequestPasswordReset from '@/pages/account/RequestPasswordReset';

export const Route = createFileRoute('/request-password-reset')({
  component: () => <RequestPasswordReset />,
});
