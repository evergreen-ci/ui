import styled from "@emotion/styled";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { AdminSettingsTabRoutes, slugs } from "constants/routes";
import { Header } from "./Header";
import { EventLogsTab } from "./tabs/EventLogsTab/EventLogsTab";
import { GeneralTab } from "./tabs/GeneralTab/GeneralTab";
import { RestartTasksTab } from "./tabs/RestartTasksTab/RestartTasksTab";
import { ServiceFlagsTab } from "./tabs/ServiceFlagsTab/ServiceFlagsTab";

export const AdminSettingsTabs: React.FC = () => {
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: AdminSettingsTabRoutes;
  }>();

  return (
    <TabsContent>
      <Header tab={tab as AdminSettingsTabRoutes} />
      <Routes>
        <Route element={<GeneralTab />} path={AdminSettingsTabRoutes.General} />
        <Route
          element={<ServiceFlagsTab />}
          path={AdminSettingsTabRoutes.ServiceFlags}
        />
        <Route
          element={<EventLogsTab />}
          path={AdminSettingsTabRoutes.EventLog}
        />
        <Route
          element={<RestartTasksTab />}
          path={AdminSettingsTabRoutes.RestartTasks}
        />
        <Route
          element={<Navigate replace to={AdminSettingsTabRoutes.General} />}
          path="*"
        />
      </Routes>
    </TabsContent>
  );
};

export const TabsContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 600px;
  width: 60%;
`;

export default AdminSettingsTabs;
