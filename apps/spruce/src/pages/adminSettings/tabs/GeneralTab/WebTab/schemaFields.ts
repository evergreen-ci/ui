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
    corpUrl: {
      title: "Corp URL",
      type: "string" as const,
    },
    httpListenAddr: {
      title: "HTTP Listen Address",
      type: "string" as const,
    },
    url: {
      format: "validURL",
      title: "Backend URL",
      type: "string" as const,
    },
  },
  uiSchema: {},
};

export const ui = {
  schema: {
    cacheTemplates: {
      title: "Cache Templates",
      type: "boolean" as const,
    },
    corsOrigins: {
      default: [],
      items: {
        properties: {
          value: {
            type: "string" as const,
          },
        },
        type: "string" as const,
      },
      title: "CORS Origins",
      type: "array" as const,
    },
    csrfKey: {
      title: "CSRF Key",
      type: "string" as const,
    },
    defaultProject: {
      title: "Default Project",
      type: "string" as const,
    },
    fileStreamingContentTypes: {
      items: {
        type: "string" as const,
      },
      title: "File Streaming Content Types",
      type: "array" as const,
    },
    httpListenAddr: {
      title: "HTTP Listen Address",
      type: "string" as const,
    },
    loginDomain: {
      title: "Login Domain",
      type: "string" as const,
    },
    parsleyUrl: {
      format: "validURL",
      title: "Parsley URL",
      type: "string" as const,
    },
    secret: {
      title: "Secret",
      type: "string" as const,
    },
    stagingEnvironment: {
      title: "Staging Environment",
      type: "string" as const,
    },
    uiv2Url: {
      format: "validURL",
      title: "UIv2 URL",
      type: "string" as const,
    },
    url: {
      format: "validURL",
      title: "URL",
      type: "string" as const,
    },
    userVoice: {
      format: "validURL",
      title: "User Voice URL",
      type: "string" as const,
    },
  },
  uiSchema: {
    cacheTemplates: {
      "ui:description": "Cache HTML templates on the legacy UI.",
    },
    corsOrigins: {
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.ChipInputWidget,
    },
    fileStreamingContentTypes: {
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.ChipInputWidget,
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
      default: [],
      items: {
        properties: {
          value: {
            type: "string" as const,
          },
        },
        type: "string" as const,
      },
      title: "Disabled GraphQL Queries",
      type: "array" as const,
    },
  },
  uiSchema: {
    queryNames: {
      "ui:elementWrapperCSS": css`
        margin-bottom: 0;
      `,
      "ui:widget": widgets.ChipInputWidget,
    },
  },
};

export const rateLimitConfig = {
  schema: {
    elevatedUsers: {
      properties: {
        elevatedUserIds: {
          default: [],
          items: {
            properties: {
              value: {
                type: "string" as const,
              },
            },
            type: "string" as const,
          },
          title: "User IDs",
          type: "array" as const,
        },
      },
      title: "Elevated Users",
      type: "object" as const,
    },
    graphqlComplexity: {
      properties: {
        graphqlComplexityLimit: {
          title: "Complexity Limit",
          type: "number" as const,
        },
      },
      title: "GraphQL Query Complexity",
      type: "object" as const,
    },
    graphqlLimits: {
      properties: {
        graphqlServiceBurst: {
          title: "Service User Burst",
          type: "number" as const,
        },
        graphqlServicePerHour: {
          title: "Service User Per Hour",
          type: "number" as const,
        },
        graphqlUserBurst: {
          title: "User Burst",
          type: "number" as const,
        },
        graphqlUserPerHour: {
          title: "User Per Hour",
          type: "number" as const,
        },
      },
      title: "GraphQL Rate Limits",
      type: "object" as const,
    },
    restLimits: {
      properties: {
        restServiceBurst: {
          title: "Service User Burst",
          type: "number" as const,
        },
        restServicePerHour: {
          title: "Service User Per Hour",
          type: "number" as const,
        },
        restUserBurst: {
          title: "User Burst",
          type: "number" as const,
        },
        restUserPerHour: {
          title: "User Per Hour",
          type: "number" as const,
        },
      },
      title: "REST Rate Limits",
      type: "object" as const,
    },
  },
  uiSchema: {
    elevatedUsers: {
      elevatedUserIds: {
        "ui:data-cy": "elevated-user-ids",
        "ui:fieldCss": fullWidthCss,
        "ui:widget": widgets.ChipInputWidget,
      },
      "ui:data-cy": "elevated-users",
      "ui:description":
        "Users who receive 2x their baseline rate and query complexity limits.",
      "ui:fieldCss": nestedObjectGridCss,
    },
    graphqlComplexity: {
      "ui:description":
        "Prevent expensive queries from being executed by blocking queries beyond the complexity limit (see https://gqlgen.com/reference/complexity).",
      "ui:fieldCss": nestedObjectGridCss,
    },
    graphqlLimits: {
      "ui:data-cy": "graphql-limits",
      "ui:description":
        "The burst limit cannot exceed the per hour limit for each user type.",
      "ui:fieldCss": nestedObjectGridCss,
    },
    restLimits: {
      "ui:data-cy": "rest-limits",
      "ui:description":
        "The burst limit cannot exceed the per hour limit for each user type.",
      "ui:fieldCss": nestedObjectGridCss,
    },
    "ui:data-cy": "rate-limit-config",
    "ui:description": "A limit of 0 means no limit is applied.",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};
