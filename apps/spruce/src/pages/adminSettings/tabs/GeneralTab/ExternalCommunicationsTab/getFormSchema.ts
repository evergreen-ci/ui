import { GetFormSchema } from "components/SpruceForm";
import {
  cedar,
  fws,
  graphite,
  jira,
  runtimeEnvironments,
  slack,
  splunk,
  testSelection,
} from "./schemaFields";

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      jira: {
        type: "object" as const,
        title: "Jira",
        properties: jira.schema,
      },
      slack: {
        type: "object" as const,
        title: "Slack",
        properties: slack.schema,
      },
      splunk: {
        type: "object" as const,
        title: "Splunk",
        properties: splunk.schema,
      },
      runtimeEnvironments: {
        type: "object" as const,
        title: "Runtime Environments",
        properties: runtimeEnvironments.schema,
      },
      testSelection: {
        type: "object" as const,
        title: "Test Selection",
        properties: testSelection.schema,
      },
      fws: {
        type: "object" as const,
        title: "Foliage Web Services",
        properties: fws.schema,
      },
      graphite: {
        type: "object" as const,
        title: "Graphite",
        properties: graphite.schema,
      },
      cedar: {
        type: "object" as const,
        title: "Cedar",
        properties: cedar.schema,
      },
    },
  },
  uiSchema: {
    jira: jira.uiSchema,
    slack: slack.uiSchema,
    splunk: splunk.uiSchema,
    runtimeEnvironments: runtimeEnvironments.uiSchema,
    testSelection: testSelection.uiSchema,
    fws: fws.uiSchema,
    graphite: graphite.uiSchema,
    cedar: cedar.uiSchema,
  },
};
