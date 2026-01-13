import { useQuery } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import Icon from "@evg-ui/lib/components/Icon";
import { usePageTitle } from "@evg-ui/lib/hooks/usePageTitle";
import {
  SettingsPageContent,
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
import { getTabTitle } from "./getTabTitle";
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
            glyph={<Icon glyph="Settings" />}
            header={getTabTitle(AdminSettingsTabRoutes.General).title}
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
                data-cy="navitem-admin-oauth-authentication"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "oauth-authentication",
                )}
              >
                OAuth Authentication
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
            <SideNavGroup header="External Communications">
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-jira"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "jira",
                )}
              >
                Jira
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-slack"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "slack",
                )}
              >
                Slack
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-splunk"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "splunk",
                )}
              >
                Splunk
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-runtime-environment"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "runtime-environments",
                )}
              >
                Runtime Environment
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-test-selection"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "test-selection",
                )}
              >
                Test Selection
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-foliage-web-services"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "foliage-web-services",
                )}
              >
                Foliage Web Services
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-cedar"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "cedar",
                )}
              >
                Cedar
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
                data-cy="navitem-admin-docker"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "docker",
                )}
              >
                Docker
              </SideNavItem>
            </SideNavGroup>
            <SideNavGroup header="Other">
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-misc-settings"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "misc-settings",
                )}
              >
                Misc Settings
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-bucket-config"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "bucket-config",
                )}
              >
                Bucket Config
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-ssh-keys"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "ssh-keys",
                )}
              >
                SSH Keys
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-expansions"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "expansions",
                )}
              >
                Expansions
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-host-jasper"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "host-jasper",
                )}
              >
                Host Jasper
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-jira-notifications"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "jira-notifications",
                )}
              >
                Jira Notifications
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-spawn-host"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "spawn-host",
                )}
              >
                Spawn Host
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-sleep-schedule"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "sleep-schedule",
                )}
              >
                Sleep Schedule
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-tracer-config"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "tracer-config",
                )}
              >
                Tracer Config
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-project-creation"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "project-creation",
                )}
              >
                Project Creation
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-github-check-run-config"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "github-check-run-config",
                )}
              >
                GitHub Check Run Config
              </SideNavItem>
              <SideNavItem
                as={Link}
                data-cy="navitem-admin-single-task-host-configuration"
                to={getAdminSettingsRoute(
                  AdminSettingsTabRoutes.General,
                  "single-task-distro-configuration",
                )}
              >
                Single Task Distro Configuration
              </SideNavItem>
            </SideNavGroup>
          </SideNavGroup>
          <SideNavGroup
            glyph={<Icon glyph="Refresh" />}
            header={getTabTitle(AdminSettingsTabRoutes.RestartTasks).title}
          >
            <SideNavItem
              as={Link}
              data-cy="navitem-admin-restart-tasks"
              to={getAdminSettingsRoute(AdminSettingsTabRoutes.RestartTasks)}
            >
              Restart Tasks
            </SideNavItem>
          </SideNavGroup>
          <SideNavGroup
            glyph={<Icon glyph="List" />}
            header={getTabTitle(AdminSettingsTabRoutes.EventLog).title}
          >
            <SideNavItem
              as={Link}
              data-cy="navitem-admin-event-logs"
              to={getAdminSettingsRoute(AdminSettingsTabRoutes.EventLog)}
            >
              Event Logs
            </SideNavItem>
          </SideNavGroup>
        </SideNav>
        <SettingsPageContent data-cy="admin-settings-page">
          {data?.adminSettings && (
            <AdminSettingsTabs data={data.adminSettings} />
          )}
        </SettingsPageContent>
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
