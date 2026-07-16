import { css } from "@emotion/react";
import { size } from "@evg-ui/lib/constants/tokens";
import { toSentenceCase } from "@evg-ui/lib/utils/string";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
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
    allowServiceUsers: {
      title: "Allow Service Users",
      type: "boolean" as const,
    },
    backgroundReauthMinutes: {
      title: "Background Reauthentication (Mins)",
      type: "number" as const,
    },
    preferredType: {
      oneOf: Object.entries(PreferredAuthType).map(([key, value]) => ({
        enum: [value],
        title: key,
        type: "string" as const,
      })),
      title: "Preferred Authentication Type",
      type: "string" as const,
    },
  },
  uiSchema: {
    allowServiceUsers: {
      "ui:fieldCss": fullWidthCss,
      "ui:options": {
        bold: true,
      },
      "ui:widget": widgets.CheckboxWidget,
    },
    preferredType: {
      "ui:fieldCss": fullWidthCss,
      "ui:options": {
        elementWrapperCSS: radioCSS,
        inline: true,
      },
      "ui:widget": widgets.RadioWidget,
    },
    "ui:fieldCss": nestedObjectGridCss,
  },
};

export const okta = {
  schema: {
    clientId: {
      title: "Client ID",
      type: "string" as const,
    },
    clientSecret: {
      title: "Client Secret",
      type: "string" as const,
    },
    expireAfterMinutes: {
      title: "Expire After (Mins)",
      type: "number" as const,
    },
    issuer: {
      title: "Issuer",
      type: "string" as const,
    },
    scopes: {
      items: {
        type: "string" as const,
      },
      title: "Scopes",
      type: "array" as const,
    },
    userGroup: {
      title: "User Group",
      type: "string" as const,
    },
  },
  uiSchema: {
    scopes: {
      "ui:elementWrapperCSS": css`
        margin-bottom: 0;
      `,
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.ChipInputWidget,
    },
    "ui:fieldCss": nestedObjectGridCss,
  },
};

export const naive = {
  schema: {
    users: {
      items: {
        properties: {
          displayName: {
            title: "Display Name",
            type: "string" as const,
          },
          email: {
            title: "Email",
            type: "string" as const,
          },
          password: {
            title: "Password",
            type: "string" as const,
          },
          username: {
            title: "Username",
            type: "string" as const,
          },
        },
        type: "object" as const,
      },
      title: "Users",
      type: "array" as const,
    },
  },
  uiSchema: {
    users: {
      items: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
      },
      "ui:addButtonText": "Add user",
      "ui:arrayCSS": css`
        margin-bottom: 0;
      `,
      "ui:arrayItemCSS": css`
        > div > div > div {
          margin-bottom: ${size.m};
        }
      `,
      "ui:fullWidth": true,
      "ui:orderable": false,
    },
  },
};

export const github = {
  schema: {
    appId: {
      title: "App ID",
      type: "number" as const,
    },
    clientId: {
      title: "Client ID",
      type: "string" as const,
    },
    clientSecret: {
      title: "Client Secret",
      type: "string" as const,
    },
    defaultOwner: {
      title: "Default Owner",
      type: "string" as const,
    },
    defaultRepo: {
      title: "Default Repository",
      type: "string" as const,
    },
    organization: {
      title: "Organization",
      type: "string" as const,
    },
    users: {
      items: {
        type: "string" as const,
      },
      title: "Users",
      type: "array" as const,
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
    users: {
      "ui:elementWrapperCSS": css`
        margin-bottom: 0;
      `,
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.ChipInputWidget,
    },
  },
};

export const oauth = {
  schema: {
    clientId: {
      title: "Client ID",
      type: "string" as const,
    },
    connectorId: {
      title: "Connector ID",
      type: "string" as const,
    },
    issuer: {
      title: "Issuer",
      type: "string" as const,
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
  },
};

const validMultiOptions = [
  PreferredAuthType.Github,
  PreferredAuthType.Okta,
  PreferredAuthType.Naive,
];

const multiOptions = [
  ...validMultiOptions.map((key) => ({
    enum: [key.toLowerCase()],
    title: toSentenceCase(key),
    type: "string" as const,
  })),
];

export const multi = {
  schema: {
    readOnly: {
      items: {
        anyOf: multiOptions,
        type: "string" as const,
      },
      title: "Read Only",
      type: "array" as const,
      uniqueItems: true,
    },
    readWrite: {
      items: {
        anyOf: multiOptions,
        type: "string" as const,
      },
      title: "Read Write",
      type: "array" as const,
      uniqueItems: true,
    },
  },
  uiSchema: {
    readOnly: {
      "ui:data-cy": "multi-read-only",
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.MultiSelectWidget,
    },
    readWrite: {
      "ui:data-cy": "multi-read-write",
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.MultiSelectWidget,
    },
  },
};

export const kanopy = {
  schema: {
    headerName: {
      title: "Header Name",
      type: "string" as const,
    },
    issuer: {
      title: "Issuer",
      type: "string" as const,
    },
    keysetURL: {
      title: "Keyset URL",
      type: "string" as const,
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
  },
};
