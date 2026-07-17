import * as React from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks";
import { ErrorBoundary } from "@evg-ui/lib/components/ErrorBoundary";
import ProtectedRoute from "@evg-ui/lib/components/ProtectedRoute";
import { AuthProvider } from "@evg-ui/lib/context/AuthProvider";
import LoginPage from "@evg-ui/lib/pages/LoginPage";
import { FileDiff } from "components/CodeChanges/FileDiff";
import { PatchDiff } from "components/CodeChanges/PatchDiff";
import { Content } from "components/Content";
import { GlobalStyles } from "components/styles";
import { observabilityRouteConfig, routes } from "constants/routes";
import ContextProviders from "context/Providers";
import { HTMLLog } from "pages/task/logs/HTMLLog";
import { TestHTMLLog } from "pages/task/logs/TestHTMLLog";
import {
  getEvergreenUrl,
  getSpruceURL,
  isLocal,
} from "utils/environmentVariables";

const AppContents: React.FC = () => {
  const { pathname } = useLocation();
  usePageVisibilityAnalytics({
    pathname,
    routeConfig: observabilityRouteConfig,
  });
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    children: [
      ...(isLocal()
        ? [
            {
              element: <LoginPage />,
              path: routes.login,
            },
          ]
        : []),
      {
        element: <HTMLLog />,
        path: routes.taskHTMLLog,
      },
      {
        element: <TestHTMLLog />,
        path: routes.testHTMLLog,
      },
      {
        element: <PatchDiff />,
        path: routes.versionDiff,
      },
      {
        element: <FileDiff />,
        path: routes.versionFileDiff,
      },
      {
        element: (
          <ProtectedRoute loginPageRoute={routes.login}>
            <ContextProviders>
              <Content />
            </ContextProviders>
          </ProtectedRoute>
        ),
        path: "/*",
      },
    ],
    element: (
      <ErrorBoundary homeURL={getSpruceURL() || ""}>
        <AuthProvider
          evergreenAppURL={getEvergreenUrl()}
          localAuthRoute={routes.login}
          remoteAuthURL={`${getEvergreenUrl()}/login`}
          shouldUseLocalAuth={isLocal()}
        >
          <AppContents />
        </AuthProvider>
      </ErrorBoundary>
    ),
  },
]);

const App: React.FC = () => (
  <>
    <GlobalStyles />
    <RouterProvider router={router} />
  </>
);

export default App;
