import styled from "@emotion/styled";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ErrorBoundary from "@evg-ui/lib/components/ErrorBoundary";
import { GlobalStyles } from "components/styles";
import routes from "constants/routes";
import { GlobalProviders } from "context";
import Content from "pages";
import { Login } from "pages/Login";
import { isDevelopmentBuild, parsleyURL } from "utils/environmentVariables";

const App = () => (
  <ErrorBoundary homeURL={parsleyURL || ""}>
    <GlobalStyles />
    <Router>
      <GlobalProviders>
        <AppWrapper>
          <Routes>
            {isDevelopmentBuild() && (
              <Route element={<Login />} path={routes.login} />
            )}
            <Route element={<Content />} path="/*" />
          </Routes>
        </AppWrapper>
      </GlobalProviders>
    </Router>
  </ErrorBoundary>
);

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default App;
