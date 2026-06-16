import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@evg-ui/lib/components/ErrorBoundary";
import { ErrorFallback } from "@evg-ui/lib/components-via/ErrorFallback";
import { NavBar } from "components/NavBar";
import { routes } from "constants/routes";
import { AgentDetailPage } from "pages/AgentDetail";
import { AgentRunsPage } from "pages/AgentRuns";
import { HomePage } from "pages/Home";

const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <main>{children}</main>
);

const Layout = () => (
  <>
    <NavBar />
    <PageLayout>
      <Outlet />
    </PageLayout>
  </>
);

const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback} homeURL="/">
        <Layout />
      </ErrorBoundary>
    ),
    children: [
      { path: routes.home, element: <HomePage /> },
      { path: routes.agentDetail, element: <AgentDetailPage /> },
      { path: routes.agentRuns, element: <AgentRunsPage /> },
      { path: routes.notFound, element: <div>Not found!</div> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
