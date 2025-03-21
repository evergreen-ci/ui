import * as React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@evg-ui/lib/components/ProtectedRoute";
import { AuthProvider } from "@evg-ui/lib/context/AuthProvider";
import LoginPage from "@evg-ui/lib/pages/LoginPage";
import { Content } from "components/Content";
import { ErrorBoundary } from "components/ErrorHandling";
import { GlobalStyles } from "components/styles";
import { routes } from "constants/routes";
import ContextProviders from "context/Providers";
import { getEvergreenUrl, isLocal } from "utils/environmentVariables";

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider
        evergreenAppURL={getEvergreenUrl()}
        localAuthRoute={routes.login}
        remoteAuthURL={`${getEvergreenUrl()}/login`}
        shouldUseLocalAuth={isLocal()}
      >
        <Outlet />
      </AuthProvider>
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
  <ErrorBoundary>
    <GlobalStyles />
    <RouterProvider router={router} />
  </ErrorBoundary>
);

export default App;
