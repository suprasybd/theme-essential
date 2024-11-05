import CategoryProducts from '@/pages/category/CategoryProducts/CategoryProducts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/category/$name/')({
  component: () => <CategoryProducts />,
});
