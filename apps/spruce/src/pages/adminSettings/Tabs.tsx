import styled from "@emotion/styled";
import { BannerTheme } from "gql/generated/types";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { AnnouncementTab } from "./tabs/AnnouncementsTab/AnnouncementTab";

export const AdminSettingsTabs = () => {
  useScrollToAnchor();

  return (
    <Container>
      <AnnouncementTab
        announcementsData={{
          banner: "test",
          bannerTheme: BannerTheme.Announcement,
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;

export default AdminSettingsTabs;
