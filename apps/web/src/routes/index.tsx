import { createFileRoute } from '@tanstack/react-router';
import { getCategoriesOptions } from '@web/components/NavBar/api';
import Home from '@web/pages/home/Home';
import { getHomeSectionsOptions } from '@web/pages/home/api';
import { Loader } from 'lucide-react';

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) => {
    const a = queryClient.ensureQueryData(getHomeSectionsOptions());
    const b = queryClient.ensureQueryData(getCategoriesOptions());

    return Promise.all([a, b]);
  },
  pendingComponent: () => (
    <div className="w-full flex justify-center items-center">
      <Loader />
    </div>
  ),

  component: () => (
    <div>
      <Home />
    </div>
  ),
});
