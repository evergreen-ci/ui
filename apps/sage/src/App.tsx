import { RouterProvider, createRouter } from "@tanstack/react-router";
import { SageProvider } from "context/SageProvider";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => (
  <SageProvider>
    <RouterProvider router={router} />
  </SageProvider>
);

export default App;
