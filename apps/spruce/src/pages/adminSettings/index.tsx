import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
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
          <ButtonsContainer>{}</ButtonsContainer>
          <SideNavGroup
            collapsible
            glyph={null}
            header="General"
            initialCollapsed={false}
          >
            <SideNavGroup header="Announcements">
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-announcements"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "announcements",
                )}
              >
                Announcements
              </SideNavItem>
            </SideNavGroup>
            <SideNavGroup header="Feature Flags">
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-feature-flags"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "services",
                )}
              >
                Services
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-notifications"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "notifications",
                )}
              >
                Notifications
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-features"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "features",
                )}
              >
                Features
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-batch-jobs"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "batch-jobs",
                )}
              >
                Batch Jobs
              </SideNavItem>
            </SideNavGroup>
            <SideNavGroup header="Runners">
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-notify"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "notify",
                )}
              >
                Notify
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-task-limits"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "task-limits",
                )}
              >
                Task Limits
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-host-init"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "host-init",
                )}
              >
                Host Init
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-pod-lifecycle"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "pod-lifecycle",
                )}
              >
                Pod Lifecycle
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-scheduler"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "scheduler",
                )}
              >
                Scheduler
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-repotracker"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "repotracker",
                )}
              >
                Repotracker
              </SideNavItem>
            </SideNavGroup>
            <SideNavGroup header="Web">
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-api-settings"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "api-settings",
                )}
              >
                API
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-ui"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "ui-settings",
                )}
              >
                UI
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-beta-features"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "beta-features",
                )}
              >
                Beta Features
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-disabled-graphql-queries"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "disabled-graphql-queries",
                )}
              >
                Disabled GraphQL Queries
              </SideNavItem>
            </SideNavGroup>
          </SideNavGroup>
          <SideNavGroup glyph={null} header="Restart Tasks">
            {}
          </SideNavGroup>
          <SideNavGroup glyph={null} header="Event Log">
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
