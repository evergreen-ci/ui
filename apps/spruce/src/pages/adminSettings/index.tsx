import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Link } from "react-router-dom";
import { size } from "@evg-ui/lib/constants/tokens";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
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
import { AdminSaveButton } from "./SaveButton";
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
                data-cy="navitem-admin-general"
                to={getAdminSettingsRoute(AdminSettingsTabRoutes.Announcements)}
              >
                Announcements
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

        <AdminSettingsContent data-cy="admin-settings-page">
          {data?.adminSettings && (
            <AdminSettingsTabs data={data.adminSettings} />
          )}
          <AdminSaveButton />
        </AdminSettingsContent>
      </SideNavPageWrapper>
    </AdminSettingsProvider>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
`;

export const AdminSettingsContent = styled.div`
  overflow-x: hidden;
  overflow-y: scroll;
  flex-grow: 1;
  padding: ${size.m} ${size.l};
  display: flex;
  flex-direction: row;
`;

export default AdminSettingsPage;
