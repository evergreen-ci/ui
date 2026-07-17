import { GetFormSchema } from "components/SpruceForm";
import {
  bucketConfig,
  debugSpawnHostsConfig,
  diagnosticsConfig,
  expansions,
  getSingleTaskDistroSchema,
  githubCheckRunConfigurations,
  hostJasper,
  jiraNotificationsFields,
  miscSettings,
  oktaServiceConfig,
  projectCreationSettings,
  sleepSchedule,
  spawnHost,
  sshPairs,
  tracerConfiguration,
} from "./schemaFields";

export const getFormSchema = ({
  projectRefs = [],
  repoRefs = [],
}: {
  projectRefs?: Array<{ id: string; displayName: string }>;
  repoRefs?: Array<{ id: string; displayName: string }>;
}): ReturnType<GetFormSchema> => {
  const singleTaskDistro = getSingleTaskDistroSchema({ projectRefs, repoRefs });
  return {
    fields: {},
    schema: {
      properties: {
        other: {
          properties: {
            bucketConfig: {
              properties: bucketConfig.schema,
              title: "Bucket Config",
              type: "object" as const,
            },
            debugSpawnHostsConfig: {
              properties: debugSpawnHostsConfig.schema,
              title: "Debug Spawn Hosts Config",
              type: "object" as const,
            },
            diagnosticsConfig: {
              properties: diagnosticsConfig.schema,
              title: "Diagnostics Config",
              type: "object" as const,
            },
            expansions: {
              properties: expansions.schema,
              title: "Expansions",
              type: "object" as const,
            },
            githubCheckRunConfigurations: {
              properties: githubCheckRunConfigurations.schema,
              title: "GitHub Check Run Config",
              type: "object" as const,
            },
            hostJasper: {
              properties: hostJasper.schema,
              title: "Host Jasper",
              type: "object" as const,
            },
            jiraNotificationsFields: {
              properties: jiraNotificationsFields.schema,
              title: "Jira Notifications",
              type: "object" as const,
            },
            miscSettings: {
              properties: miscSettings.schema,
              title: "Misc Settings",
              type: "object" as const,
            },
            oktaServiceConfig: {
              properties: oktaServiceConfig.schema,
              title: "Okta Service Config",
              type: "object" as const,
            },
            projectCreationSettings: {
              properties: projectCreationSettings.schema,
              title: "Project Creation",
              type: "object" as const,
            },
            singleTaskDistro: {
              properties: singleTaskDistro.schema,
              title: "Single Task Distro Configuration",
              type: "object" as const,
            },
            sleepSchedule: {
              properties: sleepSchedule.schema,
              title: "Sleep Schedule",
              type: "object" as const,
            },
            spawnHost: {
              properties: spawnHost.schema,
              title: "Spawn Host",
              type: "object" as const,
            },
            sshPairs: {
              properties: sshPairs.schema,
              title: "SSH Keys",
              type: "object" as const,
            },
            tracerConfiguration: {
              properties: tracerConfiguration.schema,
              title: "Tracer Config",
              type: "object" as const,
            },
          },
          title: "",
          type: "object" as const,
        },
      },
      type: "object" as const,
    },
    uiSchema: {
      other: {
        bucketConfig: bucketConfig.uiSchema,
        debugSpawnHostsConfig: debugSpawnHostsConfig.uiSchema,
        diagnosticsConfig: diagnosticsConfig.uiSchema,
        expansions: expansions.uiSchema,
        githubCheckRunConfigurations: githubCheckRunConfigurations.uiSchema,
        hostJasper: hostJasper.uiSchema,
        jiraNotificationsFields: jiraNotificationsFields.uiSchema,
        miscSettings: miscSettings.uiSchema,
        oktaServiceConfig: oktaServiceConfig.uiSchema,
        projectCreationSettings: projectCreationSettings.uiSchema,
        singleTaskDistro: singleTaskDistro.uiSchema,
        sleepSchedule: sleepSchedule.uiSchema,
        spawnHost: spawnHost.uiSchema,
        sshPairs: sshPairs.uiSchema,
        tracerConfiguration: tracerConfiguration.uiSchema,
      },
    },
  };
};
