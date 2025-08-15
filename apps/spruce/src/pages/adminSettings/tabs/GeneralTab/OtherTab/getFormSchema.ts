import { GetFormSchema } from "components/SpruceForm";
import {
  miscSettings,
  singleTaskHost,
  bucketConfig,
  sshPairs,
  expansions,
  hostJasper,
  jiraNotificationsFields,
  spawnHost,
  sleepSchedule,
  tracerConfiguration,
  projectCrationSettings,
  githubCheckRunConfigurations,
} from "./schemaFields";

export const getFormSchema: ReturnType<GetFormSchema> = {
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
          singleTaskHost: {
            type: "object" as const,
            title: "Single Task Host Configuration",
            properties: singleTaskHost.schema,
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
          projectCrationSettings: {
            type: "object" as const,
            title: "Project Creation",
            properties: projectCrationSettings.schema,
          },
          githubCheckRunConfigurations: {
            type: "object" as const,
            title: "GitHub Check Run Config",
            properties: githubCheckRunConfigurations.schema,
          },
        },
      },
    },
  },
  uiSchema: {
    other: {
      miscSettings: miscSettings.uiSchema,
      singleTaskHost: singleTaskHost.uiSchema,
      bucketConfig: bucketConfig.uiSchema,
      sshPairs: sshPairs.uiSchema,
      expansions: expansions.uiSchema,
      hostJasper: hostJasper.uiSchema,
      jiraNotificationsFields: jiraNotificationsFields.uiSchema,
      spawnHost: spawnHost.uiSchema,
      sleepSchedule: sleepSchedule.uiSchema,
      tracerConfiguration: tracerConfiguration.uiSchema,
      projectCrationSettings: projectCrationSettings.uiSchema,
      githubCheckRunConfigurations: githubCheckRunConfigurations.uiSchema,
    },
  },
};
