import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Link } from "react-router-dom";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavPageContent,
  SideNavPageWrapper,
} from "components/styles";
import {
  getAdminSettingsRoute,
  AdminSettingsTabRoutes,
} from "constants/routes";
import {
  AdminSettingsQuery,
  AdminSettingsQueryVariables,
} from "gql/generated/types";
import { ADMIN_SETTINGS } from "gql/queries";
import { AdminSettingsProvider } from "./Context";
import { AdminSettingsTabs } from "./Tabs";

const AdminSettingsPage: React.FC = () => {
  usePageTitle("Admin Settings");
  const { data } = useQuery<AdminSettingsQuery, AdminSettingsQueryVariables>(
    ADMIN_SETTINGS,
  );

  return (
    <AdminSettingsProvider>
      <SideNavPageWrapper>
        <SideNav aria-label="Admin Settings" widthOverride={250}>
          {}
          <ButtonsContainer>{}</ButtonsContainer>

          <SideNavGroup
            glyph={<Icon glyph="Settings" />}
            header="Admin Settings"
          >
            <SideNavGroup header="Announcements">
              {}
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-announcements"
                to={getAdminSettingsRoute(AdminSettingsTabRoutes.Announcements)}
              >
                Announcements
              </SideNavItem>
            </SideNavGroup>
            <SideNavGroup header="Feature Flags">
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-feature-flags"
                to="/admin-settings#services"
              >
                Services
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-notifications"
                to="/admin-settings#notifications"
              >
                Notifications
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-batch-jobs"
                to="/admin-settings#batch-jobs"
              >
                Batch Jobs
              </SideNavItem>
            </SideNavGroup>
          </SideNavGroup>
          <SideNavGroup glyph={null} header="Restart Tasks">
            {}
          </SideNavGroup>
          <SideNavGroup glyph={null} header="Tasks Logs">
            {}
          </SideNavGroup>
        </SideNav>

        <SideNavPageContent data-cy="admin-settings-page">
          {data?.adminSettings && (
            <AdminSettingsTabs data={data.adminSettings} />
          )}
        </SideNavPageContent>
      </SideNavPageWrapper>
    </AdminSettingsProvider>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
`;

export default AdminSettingsPage;
