import styled from "@emotion/styled";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks";
import ErrorBoundary from "@evg-ui/lib/components/ErrorBoundary";
import ProtectedRoute from "@evg-ui/lib/components/ProtectedRoute";
import { AuthProvider } from "@evg-ui/lib/context/AuthProvider";
import LoginPage from "@evg-ui/lib/pages/LoginPage";
import { GlobalStyles } from "components/styles";
import routes from "constants/routes";
import { GlobalProviders } from "context";
import Content from "pages";
import { evergreenURL, isLocal, parsleyURL } from "utils/environmentVariables";

const AppContents = () => {
  usePageVisibilityAnalytics();
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
      <ErrorBoundary homeURL={parsleyURL || ""}>
        <AuthProvider
          evergreenAppURL={evergreenURL || ""}
          localAuthRoute={routes.login}
          remoteAuthURL={`${evergreenURL}/login`}
          shouldUseLocalAuth={isLocal()}
        >
          <AppContents />
        </AuthProvider>
      </ErrorBoundary>
    ),
  },
]);

const App = () => (
  <>
    <GlobalStyles />
    <AppWrapper>
      <RouterProvider router={router} />
    </AppWrapper>
  </>
);

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default App;
