import * as React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AuthProvider } from "@evg-ui/lib/context/AuthProvider";
import LoginPage from "@evg-ui/lib/pages/LoginPage";
import { Content } from "components/Content";
import { ErrorBoundary } from "components/ErrorHandling";
import { GlobalStyles } from "components/styles";
import { routes } from "constants/routes";
import { ContextProviders } from "context/Providers";
import GQLWrapper from "gql/GQLWrapper";
import { getEvergreenUrl, isLocal } from "utils/environmentVariables";

const App: React.FC = () => (
  <ErrorBoundary>
    <GlobalStyles />
    <ContextProviders>
      <Router>
        <AuthProvider
          evergreenAppURL={getEvergreenUrl()}
          localAuthRoute={routes.login}
          remoteAuthURL={`${getEvergreenUrl()}/login`}
          shouldUseLocalAuth={isLocal()}
        >
          <Routes>
            {isLocal() && <Route element={<LoginPage />} path={routes.login} />}
            <Route
              element={
                <GQLWrapper>
                  <Content />
                </GQLWrapper>
              }
              path="/*"
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ContextProviders>
  </ErrorBoundary>
);

export default App;
