import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { PriorityLevel } from "gql/generated/types";
import {
  fullWidthCss,
  nestedObjectGridCss,
  objectGridCss,
} from "../../sharedStyles";

export const jira = {
  schema: {
    email: {
      title: "Email",
      type: "string" as const,
    },
    host: {
      title: "Host",
      type: "string" as const,
    },
    personalAccessToken: {
      title: "Personal Access Token",
      type: "string" as const,
    },
  },
  uiSchema: {
    personalAccessToken: {
      "ui:options": {
        inputType: "password",
      },
      "ui:widget": widgets.TextWidget,
    },
    "ui:data-cy": "jira",
    "ui:fieldCss": nestedObjectGridCss,
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const slack = {
  schema: {
    allFields: {
      title: "All Fields",
      type: "boolean" as const,
    },
    basicMetadata: {
      title: "Add basic metadata",
      type: "boolean" as const,
    },
    channel: {
      title: "Channel",
      type: "string" as const,
    },
    fields: {
      title: "Use fields",
      type: "boolean" as const,
    },
    fieldsSet: {
      default: [],
      items: {
        properties: {
          value: {
            type: "string" as const,
          },
        },
        type: "string" as const,
      },
      title: "Fields To Set",
      type: "array" as const,
    },
    hostname: {
      title: "Hostname",
      type: "string" as const,
    },
    level: {
      default: "",
      oneOf: [
        {
          enum: [""],
          title: "None",
          type: "string" as const,
        },
        ...Object.keys(PriorityLevel).map((p) => ({
          enum: [p.toUpperCase()],
          title: p,
          type: "string" as const,
        })),
      ],
      title: "Priority Level",
      type: "string" as const,
    },
    name: {
      title: "App Name",
      type: "string" as const,
    },
    optionsName: {
      title: "Name",
      type: "string" as const,
    },
    token: {
      title: "Token",
      type: "string" as const,
    },
    username: {
      title: "Username",
      type: "string" as const,
    },
  },
  uiSchema: {
    allFields: {
      "ui:description":
        "Appends all field information to the message, overriding Fields To Set.",
    },
    basicMetadata: {
      "ui:description": "Appends priority and host information to the message.",
    },
    fields: {
      "ui:description": "Appends field information to the message.",
    },
    fieldsSet: {
      "ui:description":
        "If you specify a list of field names here, only those fields will be attached to the message. Note that this behavior does not apply if All Fields is checked below.",
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.ChipInputWidget,
    },
    level: {
      "ui:allowDeselect": false,
    },
    token: {
      "ui:options": {
        inputType: "password",
      },
      "ui:widget": widgets.TextWidget,
    },
    "ui:data-cy": "slack",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

const splunkConnectionInfo = {
  schema: {
    properties: {
      channel: {
        title: "Channel",
        type: "string" as const,
      },
      serverUrl: {
        title: "Server URL",
        type: "string" as const,
      },
      token: {
        title: "Token",
        type: "string" as const,
      },
    },
    title: "Splunk Connection Info",
    type: "object" as const,
  },
  uiSchema: {
    token: {
      "ui:options": {
        inputType: "password",
      },
      "ui:widget": widgets.TextWidget,
    },
    "ui:fieldCss": nestedObjectGridCss,
  },
};

export const splunk = {
  schema: {
    splunkConnectionInfo: splunkConnectionInfo.schema,
  },
  uiSchema: {
    splunkConnectionInfo: {
      ...splunkConnectionInfo.uiSchema,
    },
    "ui:data-cy": "splunk",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const runtimeEnvironments = {
  schema: {
    apiKey: {
      title: "API Key",
      type: "string" as const,
    },
    baseUrl: {
      title: "Base URL",
      type: "string" as const,
    },
  },
  uiSchema: {
    apiKey: {
      "ui:options": {
        inputType: "password",
      },
      "ui:widget": widgets.TextWidget,
    },
    "ui:data-cy": "runtime-environments",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const testSelection = {
  schema: {
    url: {
      title: "URL",
      type: "string" as const,
    },
  },
  uiSchema: {
    "ui:data-cy": "test-selection",
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    url: {
      "ui:fullWidth": true,
    },
  },
};

export const fws = {
  schema: {
    url: {
      title: "URL",
      type: "string" as const,
    },
  },
  uiSchema: {
    "ui:data-cy": "fws",
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    url: {
      "ui:fullWidth": true,
    },
  },
};

export const graphite = {
  schema: {
    ciOptimizationToken: {
      title: "CI Optimization Token",
      type: "string" as const,
    },
    serverUrl: {
      title: "Server URL",
      type: "string" as const,
    },
  },
  uiSchema: {
    ciOptimizationToken: {
      "ui:options": {
        inputType: "password",
      },
      "ui:widget": widgets.TextWidget,
    },
    "ui:data-cy": "graphite",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const cedar = {
  schema: {
    dbName: {
      title: "Database Name",
      type: "string" as const,
    },
    dbUrl: {
      title: "Database URL",
      type: "string" as const,
    },
    spsKanopyUrl: {
      title: "SPS Kanopy URL",
      type: "string" as const,
    },
    spsUrl: {
      title: "SPS URL (Vanity, for hosts only)",
      type: "string" as const,
    },
  },
  uiSchema: {
    "ui:data-cy": "cedar",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const sage = {
  schema: {
    baseUrl: {
      title: "Base URL",
      type: "string" as const,
    },
  },
  uiSchema: {
    baseUrl: {
      "ui:description":
        "The base URL for Sage API (e.g., https://sage.prod.corp.mongodb.com)",
      "ui:fullWidth": true,
    },
    "ui:data-cy": "sage",
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};
