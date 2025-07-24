import widgets from "components/SpruceForm/Widgets";
import { fullWidthCss, radioCSS } from "../../sharedStyles";

export const api = {
  schema: {
    httpListenAddr: {
      type: "string" as const,
      title: "HTTP listen address",
    },
    url: {
      type: "string" as const,
      title: "Backend URL",
      format: "validURL",
    },
    corpUrl: {
      type: "string" as const,
      title: "Corp URL",
      format: "validURL",
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
    helpUrl: {
      type: "string" as const,
      title: "Help URL",
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
      title: "HTTP listen address",
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
  },
};

export const betaFeatures = {
  schema: {
    spruceWaterfallEnabled: {
      type: "boolean" as const,
      title: "Spruce Waterfall Enabled",
    },
  },
  uiSchema: {
    spruceWaterfallEnabled: {
      "ui:widget": widgets.RadioWidget,
      "ui:data-cy": "spruce-waterfall-enabled",
      "ui:options": {
        inline: true,
        elementWrapperCSS: radioCSS,
      },
    },
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
    },
  },
};
