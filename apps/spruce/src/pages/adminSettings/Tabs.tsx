import styled from "@emotion/styled";
import useScrollToAnchor from "hooks/useScrollToAnchor";
import { AnnouncementTab } from "./tabs/AnnouncementsTab/AnnouncementTab";
import { FeatureFlagsTab } from "./tabs/FeatureFlagsTab/FeatureFlagsTab";

export const AdminSettingsTabs = () => {
  useScrollToAnchor();

  return (
    <Container>
      <AnnouncementTab />
      <FeatureFlagsTab
        featureFlagsData={{
          featureFlags: {
            services: false,
            notifications: false,
            features: false,
            batchJobs: false,
            disabledGqlQueries: false,
          },
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
