import { GetFormSchema } from "components/SpruceForm";
import {
  cedar,
  fws,
  graphite,
  jira,
  runtimeEnvironments,
  sage,
  slack,
  splunk,
  testSelection,
} from "./schemaFields";

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    properties: {
      cedar: {
        properties: cedar.schema,
        title: "Cedar",
        type: "object" as const,
      },
      fws: {
        properties: fws.schema,
        title: "Foliage Web Services",
        type: "object" as const,
      },
      graphite: {
        properties: graphite.schema,
        title: "Graphite",
        type: "object" as const,
      },
      jira: {
        properties: jira.schema,
        title: "Jira",
        type: "object" as const,
      },
      runtimeEnvironments: {
        properties: runtimeEnvironments.schema,
        title: "Runtime Environments",
        type: "object" as const,
      },
      sage: {
        properties: sage.schema,
        title: "Sage",
        type: "object" as const,
      },
      slack: {
        properties: slack.schema,
        title: "Slack",
        type: "object" as const,
      },
      splunk: {
        properties: splunk.schema,
        title: "Splunk",
        type: "object" as const,
      },
      testSelection: {
        properties: testSelection.schema,
        title: "Test Selection",
        type: "object" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    cedar: cedar.uiSchema,
    fws: fws.uiSchema,
    graphite: graphite.uiSchema,
    jira: jira.uiSchema,
    runtimeEnvironments: runtimeEnvironments.uiSchema,
    sage: sage.uiSchema,
    slack: slack.uiSchema,
    splunk: splunk.uiSchema,
    testSelection: testSelection.uiSchema,
  },
};
