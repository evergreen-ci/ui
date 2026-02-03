import styled from "@emotion/styled";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  ErrorBoundary,
  LoginPage,
  ProtectedRoute,
} from "@evg-ui/lib/components";
import { AuthProvider } from "@evg-ui/lib/context";
import { GlobalStyles } from "components/styles";
import routes from "constants/routes";
import { GlobalProviders } from "context";
import Content from "pages";
import { evergreenURL, isLocal, parsleyURL } from "utils/environmentVariables";

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
          <Outlet />
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
