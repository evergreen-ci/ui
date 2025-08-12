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
            <SideNavGroup header="Authentication">
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-global-config"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "global-config",
                )}
              >
                Global Config
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-okta"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "okta",
                )}
              >
                Okta
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-naive-authentication"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "naive-authentication",
                )}
              >
                Naive Authentication
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-kanopy-authentication"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "kanopy-authentication",
                )}
              >
                Kanopy Authentication
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-github-authentication"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "github-authentication",
                )}
              >
                GitHub Authentication
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-multi-authentication"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "multi-authentication",
                )}
              >
                Multi Authentication
              </SideNavItem>
            </SideNavGroup>
            <SideNavGroup header="Background Processing">
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-amboy"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "amboy",
                )}
              >
                Amboy
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-logger"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "logger",
                )}
              >
                Logger
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-notification-rate-limits"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "notification-rate-limits",
                )}
              >
                Notification Rate Limits
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-triggers"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "triggers",
                )}
              >
                Triggers
              </SideNavItem>
            </SideNavGroup>
            <SideNavGroup header="Providers">
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-container-pools"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "container-pools",
                )}
              >
                Container Pools
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-aws"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "aws-configuration",
                )}
              >
                AWS Configuration
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-repo-exceptions"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "repo-exceptions",
                )}
              >
                Repo Exceptions
              </SideNavItem>
            </SideNavGroup>
          </SideNavGroup>
          <SideNavGroup glyph={null} header="Restart Tasks">
            <SideNavItem
              as={Link}
              data-cy="navitem-admin-restart-tasks"
              to={getAdminSettingsRoute(AdminSettingsTabRoutes.RestartTasks)}
            >
              Restart Tasks
            </SideNavItem>
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
