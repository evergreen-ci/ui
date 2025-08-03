import widgets from "components/SpruceForm/Widgets";
import { PriorityLevel } from "gql/generated/types";
import { nestedObjectGridCss, fullWidthCss } from "../../sharedStyles";

export const jira = {
  schema: {
    email: {
      type: "string" as const,
      title: "Email",
    },
    host: {
      type: "string" as const,
      title: "Host",
    },
    personalAccessToken: {
      type: "string" as const,
      title: "Personal Access Token",
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
    personalAccessToken: {
      "ui:widget": widgets.TextWidget,
      "ui:options": {
        inputType: "password",
      },
    },
  },
};

export const slack = {
  schema: {
    token: {
      type: "string" as const,
      title: "Token",
    },
    name: {
      type: "string" as const,
      title: "App Name",
    },
    level: {
      type: "string" as const,
      title: "Priority Level",
      enum: Object.values(PriorityLevel),
      default: "",
    },
    channel: {
      type: "string" as const,
      title: "Channel",
    },
    hostname: {
      type: "string" as const,
      title: "Hostname",
    },
    optionsName: {
      type: "string" as const,
      title: "Name",
    },
    username: {
      type: "string" as const,
      title: "Username",
    },
    fieldsSet: {
      type: "array" as const,
      title: "Fields Set",
      default: [],
      items: {
        type: "string" as const,
        properties: {
          value: {
            type: "string" as const,
          },
        },
      },
    },
    basicMetadata: {
      type: "boolean" as const,
      title: "Basic Metadata",
    },
    fields: {
      type: "boolean" as const,
      title: "Fields",
    },
    allFields: {
      type: "boolean" as const,
      title: "All Fields",
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
    token: {
      "ui:widget": widgets.TextWidget,
      "ui:options": {
        inputType: "password",
      },
    },
    level: {
      "ui:widget": widgets.SelectWidget,
    },
    fieldsSet: {
      "ui:widget": widgets.ChipInputWidget,
      "ui:fieldCss": fullWidthCss,
    },
  },
};

const splunkConnectionInfo = {
  schema: {
    type: "object" as const,
    title: "Splunk Connection Info",
    properties: {
      serverUrl: {
        type: "string" as const,
        title: "Server URL",
      },
      token: {
        type: "string" as const,
        title: "Token",
      },
      channel: {
        type: "string" as const,
        title: "Channel",
      },
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
    token: {
      "ui:widget": widgets.TextWidget,
      "ui:options": {
        inputType: "password",
      },
    },
  },
};

export const splunk = {
  schema: {
    splunkConnectionInfo: splunkConnectionInfo.schema,
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
    splunkConnectionInfo: {
      ...splunkConnectionInfo.uiSchema,
    },
  },
};

export const runtimeEnvironments = {
  schema: {
    baseUrl: {
      type: "string" as const,
      title: "Base URL",
    },
    apiKey: {
      type: "string" as const,
      title: "API Key",
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
    apiKey: {
      "ui:widget": widgets.TextWidget,
      "ui:options": {
        inputType: "password",
      },
    },
  },
};

export const testSelection = {
  schema: {
    url: {
      type: "string" as const,
      title: "URL",
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
  },
};

export const fws = {
  schema: {
    url: {
      type: "string" as const,
      title: "URL",
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
  },
};

export const cedar = {
  schema: {
    dbUrl: {
      type: "string" as const,
      title: "Database URL",
    },
    dbName: {
      type: "string" as const,
      title: "Database Name",
    },
    spsKanopyUrl: {
      type: "string" as const,
      title: "SPS Kanopy URL",
    },
    spsUrl: {
      type: "string" as const,
      title: "SPS URL (Vanity, for hosts only)",
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
  },
};
