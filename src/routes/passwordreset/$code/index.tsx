import { createFileRoute } from '@tanstack/react-router';
import PasswordReset from '@/pages/account/PasswordReset';

export const Route = createFileRoute('/passwordreset/$code/')({
  component: () => <PasswordReset />,
});
