import { css } from "@emotion/react";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import {
  fullWidthCss,
  nestedObjectGridCss,
  objectGridCss,
} from "../../sharedStyles";

export const api = {
  schema: {
    httpListenAddr: {
      type: "string" as const,
      title: "HTTP Listen Address",
    },
    url: {
      type: "string" as const,
      title: "Backend URL",
      format: "validURL",
    },
    corpUrl: {
      type: "string" as const,
      title: "Corp URL",
    },
  },
  uiSchema: {},
};

export const ui = {
  schema: {
    url: {
      type: "string" as const,
      title: "URL",
      format: "validURL",
    },
    uiv2Url: {
      type: "string" as const,
      title: "UIv2 URL",
      format: "validURL",
    },
    parsleyUrl: {
      type: "string" as const,
      title: "Parsley URL",
      format: "validURL",
    },
    fileStreamingContentTypes: {
      type: "array" as const,
      title: "File Streaming Content Types",
      items: {
        type: "string" as const,
      },
    },
    corsOrigins: {
      type: "array" as const,
      default: [],
      title: "CORS Origins",
      items: {
        type: "string" as const,
        properties: {
          value: {
            type: "string" as const,
          },
        },
      },
    },
    httpListenAddr: {
      type: "string" as const,
      title: "HTTP Listen Address",
    },
    secret: {
      type: "string" as const,
      title: "Secret",
    },
    defaultProject: {
      type: "string" as const,
      title: "Default Project",
    },
    csrfKey: {
      type: "string" as const,
      title: "CSRF Key",
    },
    loginDomain: {
      type: "string" as const,
      title: "Login Domain",
    },
    stagingEnvironment: {
      type: "string" as const,
      title: "Staging Environment",
    },
    userVoice: {
      type: "string" as const,
      title: "User Voice URL",
      format: "validURL",
    },
    cacheTemplates: {
      type: "boolean" as const,
      title: "Cache Templates",
    },
  },
  uiSchema: {
    fileStreamingContentTypes: {
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.ChipInputWidget,
    },
    corsOrigins: {
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.ChipInputWidget,
    },
    cacheTemplates: {
      "ui:description": "Cache HTML templates on the legacy UI.",
    },
  },
};

export const betaFeatures = {
  schema: {},
  uiSchema: {
    "ui:description":
      "No beta features are currently active. Enable beta features to give users early access to experimental functionality.",
    // Example for future beta features:
    // newFeature: {
    //   "ui:widget": widgets.RadioWidget,
    //   "ui:data-cy": "new-feature",
    //   "ui:options": {
    //     inline: true,
    //     elementWrapperCSS: radioCSS, // import from "../../sharedStyles"
    //   },
    // },
  },
};

export const disabledGQLQueries = {
  schema: {
    queryNames: {
      type: "array" as const,
      title: "Disabled GraphQL Queries",
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
  },
  uiSchema: {
    queryNames: {
      "ui:widget": widgets.ChipInputWidget,
      "ui:elementWrapperCSS": css`
        margin-bottom: 0;
      `,
    },
  },
};

export const rateLimitConfig = {
  schema: {
    restLimits: {
      type: "object" as const,
      title: "REST Rate Limits",
      properties: {
        restUserPerHour: {
          type: "number" as const,
          title: "User Per Hour",
        },
        restUserBurst: {
          type: "number" as const,
          title: "User Burst",
        },
        restServicePerHour: {
          type: "number" as const,
          title: "Service User Per Hour",
        },
        restServiceBurst: {
          type: "number" as const,
          title: "Service User Burst",
        },
      },
    },
    graphqlLimits: {
      type: "object" as const,
      title: "GraphQL Rate Limits",
      properties: {
        graphqlUserPerHour: {
          type: "number" as const,
          title: "User Per Hour",
        },
        graphqlUserBurst: {
          type: "number" as const,
          title: "User Burst",
        },
        graphqlServicePerHour: {
          type: "number" as const,
          title: "Service User Per Hour",
        },
        graphqlServiceBurst: {
          type: "number" as const,
          title: "Service User Burst",
        },
      },
    },
    graphqlComplexity: {
      type: "object" as const,
      title: "GraphQL Query Complexity",
      properties: {
        graphqlComplexityLimit: {
          type: "number" as const,
          title: "Complexity Limit",
        },
      },
    },
    elevatedUsers: {
      type: "object" as const,
      title: "Elevated Users",
      properties: {
        elevatedUserIds: {
          type: "array" as const,
          title: "User IDs",
          items: {
            type: "string" as const,
          },
        },
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "rate-limit-config",
    "ui:objectFieldCss": objectGridCss,
    restLimits: {
      "ui:fieldCss": nestedObjectGridCss,
    },
    graphqlLimits: {
      "ui:fieldCss": nestedObjectGridCss,
    },
    graphqlComplexity: {
      "ui:fieldCss": nestedObjectGridCss,
    },
    elevatedUsers: {
      "ui:fieldCss": nestedObjectGridCss,
      elevatedUserIds: {
        "ui:widget": widgets.ChipInputWidget,
        "ui:fieldCss": fullWidthCss,
      },
    },
  },
};
