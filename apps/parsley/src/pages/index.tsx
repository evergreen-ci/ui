import { Suspense, lazy } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { FullPageLoad } from "@evg-ui/lib/components/FullPageLoad";
import { useAnalyticAttributes } from "analytics";
import NavBar from "components/NavBar";
import { PageLayout } from "components/styles";
import { LogTypes } from "constants/enums";
import routes, { slugs } from "constants/routes";
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
  useAnalyticAttributes(user?.userId ?? "");

  return (
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
          <Route element={null} path={`:${slugs.groupID}`} />
        </Route>
        <Route
          element={<LogView logType={LogTypes.EVERGREEN_TEST_LOGS} />}
          path={routes.testLogs}
        />
        <Route
          element={<LogView logType={LogTypes.EVERGREEN_COMPLETE_LOGS} />}
          path={routes.completeLogs}
        />
        <Route element={<NotFound />} path="*" />
      </Route>
    </Routes>
  );
};

export default Content;
