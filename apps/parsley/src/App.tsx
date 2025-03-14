import styled from "@emotion/styled";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "@evg-ui/lib/context/AuthProvider";
import LoginPage from "@evg-ui/lib/pages/LoginPage";
import { ErrorBoundary } from "components/ErrorHandling";
import { GlobalStyles } from "components/styles";
import routes from "constants/routes";
import { GlobalProviders } from "context";
import Content from "pages";
import {
  evergreenURL,
  getCorpLoginURL,
  isDevelopmentBuild,
  isLocal,
} from "utils/environmentVariables";

const App = () => (
  <ErrorBoundary>
    <GlobalStyles />
    <Router>
      <AppWrapper>
        <AuthProvider
          evergreenAppURL={evergreenURL || ""}
          localAuthRoute={routes.login}
          remoteAuthURL={getCorpLoginURL()}
          shouldUseLocalAuth={isLocal()}
        >
          <Routes>
            {isDevelopmentBuild() && (
              <Route element={<LoginPage />} path={routes.login} />
            )}
            <Route
              element={
                <GlobalProviders>
                  <Content />
                </GlobalProviders>
              }
              path="/*"
            />
          </Routes>
        </AuthProvider>
      </AppWrapper>
    </Router>
  </ErrorBoundary>
);

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default App;
