import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "@evg-ui/lib/components/ErrorBoundary";
import { ErrorFallback } from "@evg-ui/lib/components-via/ErrorFallback";
import { NavBar } from "components/NavBar";

export const Route = createRootRoute({
  component: () => (
    <ErrorBoundary FallbackComponent={ErrorFallback} homeURL="/">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </ErrorBoundary>
  ),
  notFoundComponent: () => <div>Not found!</div>,
});
