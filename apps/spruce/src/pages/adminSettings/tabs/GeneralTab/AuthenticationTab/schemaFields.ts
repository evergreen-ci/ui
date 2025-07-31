import { css } from "@emotion/react";
import widgets from "components/SpruceForm/Widgets";
import { PreferredAuthType } from "gql/generated/types";
import {
  gridWrapCss,
  fullWidthCss,
  nestedObjectGridCss,
} from "../../sharedStyles";

export const radioCSS = css`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 15px;
  max-width: 100%;

  > div:first-child label {
    font-weight: 700;
  }
`;

export const usersGridCss = css`
  ${fullWidthCss};
  > fieldset {
    ${gridWrapCss};
  }
`;

export const globalConfig = {
  schema: {
    preferredType: {
      type: "string" as const,
      title: "Preferred Authentication Type",
      oneOf: Object.entries(PreferredAuthType).map(([key, value]) => ({
        type: "string" as const,
        title: key,
        enum: [value],
      })),
    },
    backgroundReauthMinutes: {
      type: "number" as const,
      title: "Background Reauthentication (Mins)",
    },
    allowServiceUsers: {
      type: "boolean" as const,
      title: "Allow Service Users",
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
    preferredType: {
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.RadioWidget,
      "ui:options": {
        inline: true,
        elementWrapperCSS: radioCSS,
      },
    },
    allowServiceUsers: {
      "ui:widget": widgets.CheckboxWidget,
      "ui:options": {
        elementWrapperCSS: css`
          > div > label > span {
            font-weight: 700;
          }
        `,
      },
    },
  },
};

export const okta = {
  schema: {
    clientId: {
      type: "string" as const,
      title: "Client ID",
    },
    clientSecret: {
      type: "string" as const,
      title: "Client Secret",
    },
    issuer: {
      type: "string" as const,
      title: "Issuer",
    },
    userGroup: {
      type: "string" as const,
      title: "User Group",
    },
    expireAfterMinutes: {
      type: "number" as const,
      title: "Expire After (Mins)",
    },
    scopes: {
      type: "array" as const,
      title: "Scopes",
      items: {
        type: "string" as const,
      },
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
    scopes: {
      "ui:widget": widgets.ChipInputWidget,
      "ui:fieldCss": fullWidthCss,
    },
  },
};

export const naive = {
  schema: {
    users: {
      type: "array" as const,
      title: "Users",
      items: {
        type: "object" as const,
        properties: {
          displayName: {
            type: "string" as const,
            title: "Display Name",
          },
          email: {
            type: "string" as const,
            title: "Email",
          },
          password: {
            type: "string" as const,
            title: "Password",
          },
          username: {
            type: "string" as const,
            title: "Username",
          },
        },
      },
    },
  },
  uiSchema: {
    users: {
      "ui:fieldCss": fullWidthCss,
      "ui:fullWidth": true,
      "ui:orderable": false,

      items: {
        "ui:fieldCss": usersGridCss,
      },
    },
  },
};

export const github = {
  schema: {
    appId: {
      type: "number" as const,
      title: "App ID",
    },
    clientId: {
      type: "string" as const,
      title: "Client ID",
    },
    clientSecret: {
      type: "string" as const,
      title: "Client Secret",
    },
    defaultOwner: {
      type: "string" as const,
      title: "Default Owner",
    },
    defaultRepo: {
      type: "string" as const,
      title: "Default Repository",
    },
    organization: {
      type: "string" as const,
      title: "Organization",
    },
    users: {
      type: "array" as const,
      title: "Users",
      items: {
        type: "string" as const,
      },
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
    users: {
      "ui:widget": widgets.ChipInputWidget,
      "ui:fieldCss": fullWidthCss,
    },
  },
};

export const multi = {
  schema: {
    readWrite: {
      type: "array" as const,
      title: "Read Write",
      items: {
        type: "string" as const,
      },
    },
    readOnly: {
      type: "array" as const,
      title: "Read Only",
      items: {
        type: "string" as const,
      },
    },
  },
  uiSchema: {
    readWrite: {
      "ui:widget": widgets.ChipInputWidget,
      "ui:fieldCss": fullWidthCss,
    },
    readOnly: {
      "ui:widget": widgets.ChipInputWidget,
      "ui:fieldCss": fullWidthCss,
    },
  },
};

export const kanopy = {
  schema: {
    headerName: {
      type: "string" as const,
      title: "Header Name",
    },
    issuer: {
      type: "string" as const,
      title: "Issuer",
    },
    keysetURL: {
      type: "string" as const,
      title: "Keyset URL",
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
  },
};
