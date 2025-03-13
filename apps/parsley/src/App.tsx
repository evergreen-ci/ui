import styled from "@emotion/styled";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "@evg-ui/lib/context/Auth";
import { ErrorBoundary } from "components/ErrorHandling";
import { GlobalStyles } from "components/styles";
import routes from "constants/routes";
import { GlobalProviders } from "context";
import Content from "pages";
import { Login } from "pages/Login";
import {
  evergreenURL,
  getCorpLoginURL,
  isDevelopmentBuild,
  isRemoteEnv,
  parsleyURL,
} from "utils/environmentVariables";

const App = () => (
  <ErrorBoundary>
    <GlobalStyles />
    <AuthProvider
      localAppURL={evergreenURL || ""}
      localAuthURL={`${parsleyURL}/login`}
      remoteAuthURL={getCorpLoginURL()}
      shouldUseLocalAuth={!isRemoteEnv()}
    >
      <Router>
        <AppWrapper>
          <Routes>
            {isDevelopmentBuild() && (
              <Route element={<Login />} path={routes.login} />
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
        </AppWrapper>
      </Router>
    </AuthProvider>
  </ErrorBoundary>
);

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default App;
