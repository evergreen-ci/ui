import styled from "@emotion/styled";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@evg-ui/lib/components/ProtectedRoute";
import { AuthProvider } from "@evg-ui/lib/context/AuthProvider";
import LoginPage from "@evg-ui/lib/pages/LoginPage";
import { ErrorBoundary } from "components/ErrorHandling";
import { GlobalStyles } from "components/styles";
import routes from "constants/routes";
import { GlobalProviders } from "context";
import Content from "pages";
import { evergreenURL, isLocal } from "utils/environmentVariables";

const router = createBrowserRouter([
  {
    children: [
      {
        element: <LoginPage />,
        path: routes.login,
      },
      {
        element: (
          <ProtectedRoute loginPageRoute={routes.login}>
            <GlobalProviders>
              <Content />
            </GlobalProviders>
          </ProtectedRoute>
        ),
        path: "/*",
      },
    ],
    element: (
      <AuthProvider
        evergreenAppURL={evergreenURL || ""}
        localAuthRoute={routes.login}
        remoteAuthURL={`${evergreenURL}/login`}
        shouldUseLocalAuth={isLocal()}
      >
        <Outlet />
      </AuthProvider>
    ),
  },
]);

const App = () => (
  <ErrorBoundary>
    <GlobalStyles />
    <AppWrapper>
      <RouterProvider router={router} />
    </AppWrapper>
  </ErrorBoundary>
);

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default App;
