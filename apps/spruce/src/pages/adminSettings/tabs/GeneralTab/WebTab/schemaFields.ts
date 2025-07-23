import { css } from "@emotion/react";
import { size } from "@evg-ui/lib/constants/tokens";
import widgets from "components/SpruceForm/Widgets";

const fullWidthCss = css`
  grid-column: span 2;
`;

const radioCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: ${size.xs};
  margin-bottom: 0px;
  max-width: 100%;
`;

export const api = {
  schema: {
    httpListenAddr: {
      type: "string" as const,
      title: "HTTP listen address",
    },
    url: {
      type: "string" as const,
      title: "Backend URL",
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
    },
    helpUrl: {
      type: "string" as const,
      title: "Help URL",
    },
    uiv2Url: {
      type: "string" as const,
      title: "UIv2 URL",
    },
    parsleyUrl: {
      type: "string" as const,
      title: "Parsley URL",
    },
    fileStreamingContentTypes: {
      type: "array" as const,
      items: {
        type: "string" as const,
      },
      title: "File Streaming Content Types",
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
      title: "User Voice",
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
