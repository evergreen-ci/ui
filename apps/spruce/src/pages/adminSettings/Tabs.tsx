import { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { AdminSettings } from "gql/generated/types";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { AdminSaveButton } from "./AdminSaveButton";
import { useAdminSettingsContext } from "./Context";
import { AnnouncementTab } from "./tabs/AnnouncementsTab/AnnouncementTab";
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
      <Forms>
        <AnnouncementTab announcementsData={tabData.announcements} />
      </Forms>
      <AdminSaveButton />
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

const Forms = styled.div`
  min-width: 600px;
  width: 60%;
`;

export const TabsContent = styled.div`
  display: flex;
  flex-direction: row;
`;

export default AdminSettingsTabs;
