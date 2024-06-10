import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import NavBar from '../components/NavBar/NavBar';
import Modals from '@web/components/Modals/Modals';

const RootComponent: React.FC = () => {
  return (
    <>
      <NavBar />
      <Modals />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
};
interface MyRouterContext {
  hasCookie: boolean;
}
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <RootComponent />,
});
