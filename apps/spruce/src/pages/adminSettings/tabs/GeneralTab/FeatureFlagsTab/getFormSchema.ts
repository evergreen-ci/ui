import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { radioCSS } from "../../sharedStyles";

/**
 * Generates properties for ui form
 * @param items - maps variable names to display names
 * @returns variable name mapped to form
 */
function generateProperties(
  items: Record<string, string>,
): Record<string, any> {
  return Object.entries(items).reduce(
    (acc, [key, title]) => {
      acc[key] = {
        type: "boolean" as const,
        title,
        oneOf: [
          { const: true, title: "Disabled" },
          { const: false, title: "Enabled" },
        ],
      };
      return acc;
    },
    {} as Record<string, any>,
  );
}

const zebraCSS = css`
  > div > {
    :nth-child(even) {
      background-color: ${palette.gray.light3};
    }

    :not(:last-child) {
      border-bottom: 1px solid ${palette.gray.light2};
    }
  }
`;

/**
 * Generates properties for ui schema
 * @param items - maps variable names to schema properties
 * @returns variable name mapped to ui schema
 */
function generateUiSchema(
  items: Record<string, string>,
): Record<string, Record<string, any>> {
  return Object.keys(items).reduce(
    (acc, key) => {
      acc[key] = {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": zebraCSS,
        "ui:widget": widgets.RadioWidget,
        "ui:options": {
          inline: true,
          elementWrapperCSS: radioCSS,
        },
      };
      return acc;
    },
    {} as Record<string, Record<string, any>>,
  );
}

const generateSchema = (fields: Record<string, string>) => ({
  properties: generateProperties(fields),
  uiSchema: generateUiSchema(fields),
});

const serviceItems = generateSchema({
  taskDispatchDisabled: "Dispatch tasks",
  largeParserProjectsDisabled: "Large parser projects",
  hostInitDisabled: "Create and provision hosts",
  podInitDisabled: "Create and provision pods",
  monitorDisabled: "Monitor hosts and tasks",
  agentStartDisabled: "Start agents on hosts",
  schedulerDisabled: "Schedule tasks",
  hostAllocatorDisabled: "Host Allocator",
  systemFailedTaskRestartDisabled: "Auto-restart system failures",
  podAllocatorDisabled: "Allocate pods for container tasks",
  unrecognizedPodCleanupDisabled: "Clean up unrecognized pods",
  cloudCleanupDisabled: "Cloud Provider Cleanup",
});

const notificationItems = generateSchema({
  eventProcessingDisabled: "Process notification events",
  alertsDisabled: "Alert for spawn host expiration",
  jiraNotificationsDisabled: "Send JIRA notifications",
  slackNotificationsDisabled: "Send Slack notifications",
  emailNotificationsDisabled: "Send Email notifications",
  webhookNotificationsDisabled: "Send Webhook notifications",
  githubStatusAPIDisabled: "Send Github PR status notifications",
});

const featureItems = generateSchema({
  repotrackerDisabled: "Track GitHub repositories",
  githubPRTestingDisabled: "Test GitHub pull requests",
  degradedModeDisabled: "CPU Degraded Mode",
  jwtTokenForCLIDisabled: "Use JWT token for CLI",
  checkBlockedTasksDisabled: "Check Blocked Tasks",
  taskLoggingDisabled: "Persist task and test logs",
  cliUpdatesDisabled: "Update CLI",
  sleepScheduleDisabled: "Unexpirable host sleep schedule",
  releaseModeDisabled: "Release Mode",
  elasticIPsDisabled: "Elastic IPs  for task hosts",
  staticAPIKeysDisabled: "Static API Keys credentials for users",
  backgroundReauthDisabled: "Background Reauthentication",
  debugSpawnHostDisabled: "Debug spawn hosts",
  useGitForGitHubFilesDisabled: "Use git to fetch files from GitHub",
  useMergeQueuePathFilteringDisabled: "Merge queue path filtering",
});

const batchJobItems = generateSchema({
  backgroundStatsDisabled: "Collect background statistics",
  cacheStatsJobDisabled: "Cache historical statistics",
  cacheStatsEndpointDisabled: "Cache historical statistics endpoint",
  s3LifecycleSyncDisabled: "S3 Lifecycle sync",
});

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      featureFlags: {
        type: "object" as const,
        title: "",
        properties: {
          services: {
            type: "object" as const,
            title: "Services",
            properties: serviceItems.properties,
          },
          notifications: {
            type: "object" as const,
            title: "Notifications",
            properties: notificationItems.properties,
          },
          features: {
            type: "object" as const,
            title: "Features",
            properties: featureItems.properties,
          },
          batchJobs: {
            type: "object" as const,
            title: "Batch Jobs",
            properties: batchJobItems.properties,
          },
        },
      },
    },
  },
  uiSchema: {
    featureFlags: {
      services: serviceItems.uiSchema,
      notifications: notificationItems.uiSchema,
      features: featureItems.uiSchema,
      batchJobs: batchJobItems.uiSchema,
    },
  },
};
