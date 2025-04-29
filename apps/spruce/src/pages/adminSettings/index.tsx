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
import { AdminSettingsProvider } from "./Context";
import { AdminSettingsTab } from "./Tabs";

const AdminSettings: React.FC = () => {
  usePageTitle("Admin Settings");

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
            <SideNavItem
              as={Link}
              data-cy="navitem-admin-general"
              to="/admin-settings"
            >
              Announcements
            </SideNavItem>
          </SideNavGroup>

          <SideNavGroup glyph={null} header="Restart Tasks">
            {}
          </SideNavGroup>
          <SideNavGroup glyph={null} header="Tasks Logs">
            {}
          </SideNavGroup>
        </SideNav>

        <SideNavPageContent data-cy="admin-settings-page">
          <AdminSettingsTab />
        </SideNavPageContent>
      </SideNavPageWrapper>
    </AdminSettingsProvider>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* Adjust styling as necessary for the button container */
  margin: 0; /* Customize margins based on specific layout needs */
`;

export default AdminSettings;
