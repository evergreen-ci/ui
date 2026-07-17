import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "@evg-ui/lib/components/ErrorBoundary";
import { ErrorFallback } from "@evg-ui/lib/components-via/ErrorFallback";
import { NavBar } from "components/NavBar";
import { useSageContext } from "context/SageProvider";

const RootComponent = () => {
  const { auth } = useSageContext();
  const { hasCheckedAuth, isAuthenticated } = auth;

  if (!hasCheckedAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return <div>Unauthorized</div>;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} homeURL="/">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </ErrorBoundary>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <div>Not found!</div>,
});
