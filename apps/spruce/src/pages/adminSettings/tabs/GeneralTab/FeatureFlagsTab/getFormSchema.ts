import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { radioCSS } from "../../sharedStyles";

const serviceItems: Record<string, string> = {
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
};

const notificationItems: Record<string, string> = {
  eventProcessingDisabled: "Process notification events",
  alertsDisabled: "Alert for spawn host expiration",
  jiraNotificationsDisabled: "Send JIRA notifications",
  slackNotificationsDisabled: "Send Slack notifications",
  emailNotificationsDisabled: "Send Email notifications",
  webhookNotificationsDisabled: "Send Webhook notifications",
  githubStatusAPIDisabled: "Send Github PR status notifications",
};

const featureItems: Record<string, string> = {
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
  psLoggingDisabled: "Process logging for agent tasks",
};

const batchJobItems: Record<string, string> = {
  backgroundStatsDisabled: "Collect background statistics",
  cacheStatsJobDisabled: "Cache historical statistics",
  cacheStatsEndpointDisabled: "Cache historical statistics endpoint",
  s3LifecycleSyncDisabled: "S3 Lifecycle sync",
};

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

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
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
            properties: generateProperties(serviceItems),
          },
          notifications: {
            type: "object" as const,
            title: "Notifications",
            properties: generateProperties(notificationItems),
          },
          features: {
            type: "object" as const,
            title: "Features",
            properties: generateProperties(featureItems),
          },
          batchJobs: {
            type: "object" as const,
            title: "Batch Jobs",
            properties: generateProperties(batchJobItems),
          },
        },
      },
    },
  },
  uiSchema: {
    featureFlags: {
      services: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": zebraCSS,
        ...generateUiSchema(serviceItems),
      },
      notifications: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": zebraCSS,
        ...generateUiSchema(notificationItems),
      },
      features: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": zebraCSS,
        ...generateUiSchema(featureItems),
      },
      batchJobs: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:objectFieldCss": zebraCSS,
        ...generateUiSchema(batchJobItems),
      },
    },
  },
});
