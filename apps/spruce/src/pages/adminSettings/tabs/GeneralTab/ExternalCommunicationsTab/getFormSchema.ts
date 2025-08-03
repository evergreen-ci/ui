import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { objectGridCss } from "../../sharedStyles";
import {
  cedar,
  fws,
  jira,
  runtimeEnvironments,
  slack,
  splunk,
  testSelection,
} from "./schemaFields";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      jira: {
        type: "object" as const,
        title: "JIRA",
        properties: {
          ...jira.schema,
        },
      },
      slack: {
        type: "object" as const,
        title: "Slack",
        properties: {
          ...slack.schema,
        },
      },
      splunk: {
        type: "object" as const,
        title: "Splunk",
        properties: {
          ...splunk.schema,
        },
      },
      runtimeEnvironments: {
        type: "object" as const,
        title: "Runtime Environments",
        properties: {
          ...runtimeEnvironments.schema,
        },
      },
      testSelection: {
        type: "object" as const,
        title: "Test Selection",
        properties: {
          ...testSelection.schema,
        },
      },
      fws: {
        type: "object" as const,
        title: "FWS",
        properties: {
          ...fws.schema,
        },
      },
      cedar: {
        type: "object" as const,
        title: "Cedar",
        properties: {
          ...cedar.schema,
        },
      },
    },
  },
  uiSchema: {
    jira: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:data-cy": "jira",
      "ui:objectFieldCss": objectGridCss,
      ...jira.uiSchema,
    },
    slack: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:objectFieldCss": objectGridCss,
      "ui:data-cy": "slack",
      ...slack.uiSchema,
    },
    splunk: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:objectFieldCss": objectGridCss,
      "ui:data-cy": "splunk",
      ...splunk.uiSchema,
    },
    runtimeEnvironments: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:objectFieldCss": objectGridCss,
      "ui:data-cy": "runtime-environments",
      ...runtimeEnvironments.uiSchema,
    },
    testSelection: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:objectFieldCss": objectGridCss,
      "ui:data-cy": "test-selection",
      ...testSelection.uiSchema,
    },
    fws: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:objectFieldCss": objectGridCss,
      "ui:data-cy": "fws",
      ...fws.uiSchema,
    },
    cedar: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:objectFieldCss": objectGridCss,
      "ui:data-cy": "cedar",
      ...cedar.uiSchema,
    },
  },
});
