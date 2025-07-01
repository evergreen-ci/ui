import { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminSettingsTabRoutes } from "constants/routes";
import { AdminSettings } from "gql/generated/types";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { AdminSaveButton } from "./AdminSaveButton";
import { useAdminSettingsContext } from "./Context";
import { GeneralTab } from "./tabs/GeneralTab/GeneralTab";
import { gqlToFormMap } from "./tabs/transformers";
import { FormStateMap, WritableAdminSettingsType } from "./tabs/types";

interface Props {
  data: AdminSettings;
}

export const AdminSettingsTabs: React.FC<Props> = ({ data }) => {
  const { setInitialData } = useAdminSettingsContext();

  const tabData = useMemo(() => getTabData(data), [data]);
  useEffect(() => {
    setInitialData(tabData);
  }, [setInitialData, tabData]);
  useScrollToAnchor();
  return (
    <TabsContent>
      <AdminSaveButton />
      <Routes>
        <Route
          element={<GeneralTab tabData={tabData} />}
          path={AdminSettingsTabRoutes.General}
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
