import { createFileRoute } from '@tanstack/react-router';
import Page from '@/pages/page/Page';

export const Route = createFileRoute('/page/$url/')({
  component: () => <Page />,
});
