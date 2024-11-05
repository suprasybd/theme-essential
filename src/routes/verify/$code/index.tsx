import { createFileRoute } from '@tanstack/react-router';
import VerifyCode from '@/pages/verify/VerifyCode';

export const Route = createFileRoute('/verify/$code/')({
  component: () => <VerifyCode />,
});
