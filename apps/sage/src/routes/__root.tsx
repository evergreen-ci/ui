import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NavBar } from "components/NavBar";

export const Route = createRootRoute({
  component: () => (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  ),
  notFoundComponent: () => <div>Not found!</div>,
});
