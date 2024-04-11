import { Suspense, lazy } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAnalyticAttributes } from "analytics";
import { FullPageLoad } from "components/FullPageLoad";
import NavBar from "components/NavBar";
import { PageLayout } from "components/styles";
import { LogTypes } from "constants/enums";
import routes from "constants/routes";
import { useAuthContext } from "context/auth";
import { useUser } from "hooks";
import NotFound from "./404";
import LogView from "./LogView";

const LogDrop = lazy(() => import("./LogDrop"));

const Layout = () => (
  <>
    <NavBar />
    <PageLayout>
      <Outlet />
    </PageLayout>
  </>
);

const Content: React.FC = () => {
  const { user } = useUser();
  localStorage.setItem("userId", user?.userId ?? "");

  useAnalyticAttributes();
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<Navigate to={routes.upload} />} path={routes.root} />
        <Route
          element={
            <Suspense fallback={<FullPageLoad />}>
              <LogDrop />
            </Suspense>
          }
          path={routes.upload}
        />
        <Route
          element={<LogView logType={LogTypes.EVERGREEN_TASK_FILE} />}
          path={routes.taskFiles}
        />
        <Route
          element={<LogView logType={LogTypes.EVERGREEN_TASK_LOGS} />}
          path={routes.evergreenLogs}
        />
        <Route
          element={<LogView logType={LogTypes.EVERGREEN_TEST_LOGS} />}
          path={routes.testLogs}
        >
          <Route element={null} path=":groupId" />
        </Route>
        <Route
          element={<LogView logType={LogTypes.EVERGREEN_TEST_LOGS} />}
          path={routes.testLogs}
        />
        <Route
          element={<LogView logType={LogTypes.LOGKEEPER_LOGS} />}
          path={routes.logkeeperLogs}
        />
        <Route
          element={<LogView logType={LogTypes.LOGKEEPER_LOGS} />}
          path={routes.resmokeLogsAll}
        />
        <Route
          element={<LogView logType={LogTypes.EVERGREEN_COMPLETE_LOGS} />}
          path={routes.completeLogs}
        />
        <Route element={<NotFound />} path="*" />
      </Route>
    </Routes>
  ) : (
    <FullPageLoad />
  );
};

export default Content;
