import { createFileRoute } from '@tanstack/react-router';
import Page from '@web/pages/page/Page';

export const Route = createFileRoute('/page/$url/')({
  component: () => <Page />,
});
