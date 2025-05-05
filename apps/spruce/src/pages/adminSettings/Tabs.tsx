import styled from "@emotion/styled";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { AnnouncementTab } from "./tabs/AnnouncementsTab/AnnouncementTab";

export const AdminSettingsTabs = () => {
  useScrollToAnchor();

  return (
    <Container>
      <AnnouncementTab />
    </Container>
  );
};

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;

export default AdminSettingsTabs;
