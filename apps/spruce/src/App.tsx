import * as React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import ErrorBoundary from "@evg-ui/lib/components/ErrorBoundary";
import { Content } from "components/Content";
import { GlobalStyles } from "components/styles";
import { routes } from "constants/routes";
import { ContextProviders } from "context/Providers";
import GQLWrapper from "gql/GQLWrapper";
import { Login } from "pages/Login";
import {
  getSpruceURL,
  isDevelopmentBuild,
  isLocal,
} from "utils/environmentVariables";

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
  <ErrorBoundary homeURL={getSpruceURL() || ""}>
    <GlobalStyles />
    <ContextProviders>
      <RouterProvider router={browserRouter} />
    </ContextProviders>
  </ErrorBoundary>
);

export default App;
