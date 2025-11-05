import * as React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ErrorBoundary from "@evg-ui/lib/components/ErrorBoundary";
import ProtectedRoute from "@evg-ui/lib/components/ProtectedRoute";
import { AuthProvider } from "@evg-ui/lib/context/AuthProvider";
import LoginPage from "@evg-ui/lib/pages/LoginPage";
import { Content } from "components/Content";
import { GlobalStyles } from "components/styles";
import { routes } from "constants/routes";
import ContextProviders from "context/Providers";
import { HTMLLog } from "pages/task/logs/HTMLLog";
import {
  getEvergreenUrl,
  getSpruceURL,
  isLocal,
} from "utils/environmentVariables";

const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary homeURL={getSpruceURL() || ""}>
        <AuthProvider
          evergreenAppURL={getEvergreenUrl()}
          localAuthRoute={routes.login}
          remoteAuthURL={`${getEvergreenUrl()}/login`}
          shouldUseLocalAuth={isLocal()}
        >
          <Outlet />
        </AuthProvider>
      </ErrorBoundary>
    ),
    children: [
      ...(isLocal()
        ? [
            {
              path: routes.login,
              element: <LoginPage />,
            },
          ]
        : []),
      {
        path: "/task/:taskId/html-log",
        element: <HTMLLog />,
      },
      {
        path: "/*",
        element: (
          <ProtectedRoute loginPageRoute={routes.login}>
            <ContextProviders>
              <Content />
            </ContextProviders>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App: React.FC = () => (
  <>
    <GlobalStyles />
    <RouterProvider router={router} />
  </>
);

export default App;
