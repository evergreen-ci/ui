import { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { AdminSettingsTabRoutes, slugs } from "constants/routes";
import { AdminSettingsQuery } from "gql/generated/types";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { useAdminSettingsContext } from "./Context";
import { Header } from "./Header";
import { EventLogsTab } from "./tabs/EventLogsTab/EventLogsTab";
import { GeneralTab } from "./tabs/GeneralTab/GeneralTab";
import { RestartTasksTab } from "./tabs/RestartTasksTab/RestartTasksTab";
import { ServiceFlagsTab } from "./tabs/ServiceFlagsTab/ServiceFlagsTab";
import { gqlToFormMap } from "./tabs/transformers";
import { FormStateMap, WritableAdminSettingsType } from "./tabs/types";

type Props = {
  data: NonNullable<AdminSettingsQuery["adminSettings"]>;
};

export const AdminSettingsTabs: React.FC<Props> = ({ data }) => {
  const { [slugs.tab]: tab } = useParams<{
    [slugs.tab]: AdminSettingsTabRoutes;
  }>();
  const { setInitialData } = useAdminSettingsContext();
  const tabData = useMemo(() => getTabData(data), [data]);
  useEffect(() => {
    setInitialData(tabData);
  }, [setInitialData, tabData]);
  useScrollToAnchor();

  return (
    <TabsContent>
      <Header adminSettingsData={data} tab={tab as AdminSettingsTabRoutes} />
      <Routes>
        <Route
          element={<GeneralTab tabData={tabData} />}
          path={AdminSettingsTabRoutes.General}
        />
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

const getTabData = (data: Props["data"]): FormStateMap =>
  Object.keys(gqlToFormMap).reduce((obj, tab) => {
    const gqlToFormFn = gqlToFormMap[tab as WritableAdminSettingsType];
    if (gqlToFormFn) {
      return {
        ...obj,
        [tab]: gqlToFormFn(data),
      };
    }
    return obj;
  }, {} as FormStateMap);

export const TabsContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 600px;
  width: 60%;
`;

export default AdminSettingsTabs;
