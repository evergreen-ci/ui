import { css } from "@emotion/react";
import { size } from "@evg-ui/lib/constants";
import { toSentenceCase } from "@evg-ui/lib/utils";
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
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.CheckboxWidget,
      "ui:options": {
        bold: true,
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
      "ui:elementWrapperCSS": css`
        margin-bottom: 0;
      `,
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
      "ui:fullWidth": true,
      "ui:orderable": false,
      "ui:addButtonText": "Add user",
      "ui:arrayCSS": css`
        margin-bottom: 0;
      `,
      "ui:arrayItemCSS": css`
        > div > div > div {
          margin-bottom: ${size.m};
        }
      `,
      items: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
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
      "ui:elementWrapperCSS": css`
        margin-bottom: 0;
      `,
    },
  },
};

export const oauth = {
  schema: {
    clientId: {
      type: "string" as const,
      title: "Client ID",
    },
    issuer: {
      type: "string" as const,
      title: "Issuer",
    },
    connectorId: {
      type: "string" as const,
      title: "Connector ID",
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
    type: "string" as const,
    title: toSentenceCase(key),
    enum: [key.toLowerCase()],
  })),
];

export const multi = {
  schema: {
    readWrite: {
      type: "array" as const,
      title: "Read Write",
      uniqueItems: true,
      items: {
        type: "string" as const,
        anyOf: multiOptions,
      },
    },
    readOnly: {
      type: "array" as const,
      title: "Read Only",
      uniqueItems: true,
      items: {
        type: "string" as const,
        anyOf: multiOptions,
      },
    },
  },
  uiSchema: {
    readWrite: {
      "ui:data-cy": "multi-read-write",
      "ui:widget": widgets.MultiSelectWidget,
      "ui:fieldCss": fullWidthCss,
    },
    readOnly: {
      "ui:data-cy": "multi-read-only",
      "ui:widget": widgets.MultiSelectWidget,
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
