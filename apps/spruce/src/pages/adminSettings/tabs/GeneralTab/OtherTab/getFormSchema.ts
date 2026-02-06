import { GetFormSchema } from "components/SpruceForm";
import {
  miscSettings,
  getSingleTaskDistroSchema,
  bucketConfig,
  sshPairs,
  expansions,
  hostJasper,
  jiraNotificationsFields,
  spawnHost,
  debugSpawnHostsConfig,
  sleepSchedule,
  tracerConfiguration,
  projectCreationSettings,
  githubCheckRunConfigurations,
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
      type: "object" as const,
      properties: {
        other: {
          type: "object" as const,
          title: "",
          properties: {
            miscSettings: {
              type: "object" as const,
              title: "Misc Settings",
              properties: miscSettings.schema,
            },
            bucketConfig: {
              type: "object" as const,
              title: "Bucket Config",
              properties: bucketConfig.schema,
            },
            sshPairs: {
              type: "object" as const,
              title: "SSH Keys",
              properties: sshPairs.schema,
            },
            expansions: {
              type: "object" as const,
              title: "Expansions",
              properties: expansions.schema,
            },
            hostJasper: {
              type: "object" as const,
              title: "Host Jasper",
              properties: hostJasper.schema,
            },
            jiraNotificationsFields: {
              type: "object" as const,
              title: "Jira Notifications",
              properties: jiraNotificationsFields.schema,
            },
            spawnHost: {
              type: "object" as const,
              title: "Spawn Host",
              properties: spawnHost.schema,
            },
            debugSpawnHostsConfig: {
              type: "object" as const,
              title: "Debug Spawn Hosts Config",
              properties: debugSpawnHostsConfig.schema,
            },
            sleepSchedule: {
              type: "object" as const,
              title: "Sleep Schedule",
              properties: sleepSchedule.schema,
            },
            tracerConfiguration: {
              type: "object" as const,
              title: "Tracer Config",
              properties: tracerConfiguration.schema,
            },
            projectCreationSettings: {
              type: "object" as const,
              title: "Project Creation",
              properties: projectCreationSettings.schema,
            },
            githubCheckRunConfigurations: {
              type: "object" as const,
              title: "GitHub Check Run Config",
              properties: githubCheckRunConfigurations.schema,
            },
            singleTaskDistro: {
              type: "object" as const,
              title: "Single Task Distro Configuration",
              properties: singleTaskDistro.schema,
            },
          },
        },
      },
    },
    uiSchema: {
      other: {
        miscSettings: miscSettings.uiSchema,
        singleTaskDistro: singleTaskDistro.uiSchema,
        bucketConfig: bucketConfig.uiSchema,
        sshPairs: sshPairs.uiSchema,
        expansions: expansions.uiSchema,
        hostJasper: hostJasper.uiSchema,
        jiraNotificationsFields: jiraNotificationsFields.uiSchema,
        spawnHost: spawnHost.uiSchema,
        debugSpawnHostsConfig: debugSpawnHostsConfig.uiSchema,
        sleepSchedule: sleepSchedule.uiSchema,
        tracerConfiguration: tracerConfiguration.uiSchema,
        projectCreationSettings: projectCreationSettings.uiSchema,
        githubCheckRunConfigurations: githubCheckRunConfigurations.uiSchema,
      },
    },
  };
};
