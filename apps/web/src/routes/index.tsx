import { createFileRoute } from '@tanstack/react-router';
import Home from '@web/pages/home/Home';

export const Route = createFileRoute('/')({
  component: () => (
    <div>
      <Home />
    </div>
  ),
});
