import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import NavBar from '../components/NavBar/NavBar';
import Modals from '@web/components/Modals/Modals';

const RootComponent: React.FC = () => {
  return (
    <>
      <header className="w-full max-w-[1220px] h-fit mx-auto gap-6 py-6 px-4 sm:px-8 ">
        <NavBar />
      </header>

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
