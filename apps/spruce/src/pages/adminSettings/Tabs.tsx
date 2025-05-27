import { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { AdminSettings } from "gql/generated/types";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { useAdminSettingsContext } from "./Context";
import { AnnouncementTab } from "./tabs/AnnouncementsTab/AnnouncementTab";
import { gqlToFormMap } from "./tabs/transformers";
import { FormStateMap } from "./tabs/types";

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
    <Container>
      <AnnouncementTab announcementsData={tabData.announcements} />
    </Container>
  );
};

const getTabData = (data: Props["data"]): FormStateMap =>
  Object.keys(gqlToFormMap).reduce(
    (obj, tab) => ({
      ...obj,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      [tab]: gqlToFormMap[tab](data),
    }),
    {} as FormStateMap,
  );

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;

export default AdminSettingsTabs;
