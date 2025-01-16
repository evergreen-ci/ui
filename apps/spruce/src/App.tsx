import * as React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Content } from "components/Content";
import { ErrorBoundary } from "components/ErrorHandling";
import { GlobalStyles } from "components/styles";
import { routes } from "constants/routes";
import { ContextProviders } from "context/Providers";
import GQLWrapper from "gql/GQLWrapper";
import { Login } from "pages/Login";
import { isDevelopmentBuild, isLocal } from "utils/environmentVariables";

const browserRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      {(isDevelopmentBuild() || isLocal()) && (
        <Route element={<Login />} path={routes.login} />
      )}
      <Route
        element={
          <GQLWrapper>
            <Content />
          </GQLWrapper>
        }
        path="/*"
      />
    </>,
  ),
);

const App: React.FC = () => (
  <ErrorBoundary>
    <GlobalStyles />
    <ContextProviders>
      <RouterProvider router={browserRouter} />
    </ContextProviders>
  </ErrorBoundary>
);

export default App;
