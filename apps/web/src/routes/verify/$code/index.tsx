import { createFileRoute } from '@tanstack/react-router';
import VerifyCode from '@web/pages/verify/VerifyCode';

export const Route = createFileRoute('/verify/$code/')({
  component: () => <VerifyCode />,
});
