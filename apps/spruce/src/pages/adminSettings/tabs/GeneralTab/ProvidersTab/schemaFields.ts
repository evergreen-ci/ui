import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { MongoDbEnvironment } from "gql/generated/types";
import {
  fullWidthCss,
  gridWrapCss,
  nestedObjectGridCss,
  objectGridCss,
} from "../../sharedStyles";

const { gray } = palette;

const mongodbEnvironmentOptions = [
  { label: "None", value: "" },
  ...Object.values(MongoDbEnvironment).map((value) => ({
    label: value.toLowerCase(),
    value,
  })),
];

const arrayItemCSS = css`
  border: 1px solid ${gray.light2};
  border-radius: ${size.m};
  padding: ${size.m};
  margin-bottom: ${size.s};

  // Grid wrap for the inputs inside the array item.
  > div > fieldset {
    ${gridWrapCss};
  }
`;

export const containerPools = {
  schema: {
    pools: {
      type: "array" as const,
      title: "",
      items: {
        type: "object" as const,
        properties: {
          id: {
            type: "string" as const,
            title: "ID",
            default: "",
            minLength: 1,
          },
          distro: {
            type: "string" as const,
            title: "Distro",
            default: "",
            minLength: 1,
          },
          maxContainers: {
            type: "number" as const,
            title: "Max Containers",
            default: 0,
            minimum: 0,
          },
          port: {
            type: "number" as const,
            title: "Port",
            default: 0,
            minimum: 0,
            maximum: 65535,
          },
        },
        required: ["id", "distro"],
      },
      default: [],
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-testid": "container-pools",
    "ui:objectFieldCss": objectGridCss,
    pools: {
      "ui:label": false,
      "ui:addButtonText": "Add container pool",
      "ui:data-testid": "container-pools-list",
      "ui:orderable": false,
      "ui:fullWidth": true,
      "ui:fieldCss": fullWidthCss,
      "ui:arrayItemCSS": arrayItemCSS,
      items: {
        "ui:label": false,
      },
    },
  },
};

const accountRoles = {
  schema: {
    type: "array" as const,
    title: "Account Roles",
    items: {
      type: "object" as const,
      properties: {
        account: {
          type: "string" as const,
          title: "Account",
          default: "",
          minLength: 1,
        },
        role: {
          type: "string" as const,
          title: "Role",
          default: "",
          minLength: 1,
        },
      },
      required: ["account", "role"],
    },
    default: [],
  },
  uiSchema: {
    "ui:addButtonText": "Add account role",
    "ui:data-testid": "account-roles-list",
    "ui:orderable": false,
    "ui:fullWidth": true,
    "ui:fieldCss": fullWidthCss,
    "ui:arrayItemCSS": arrayItemCSS,
    items: {
      "ui:label": false,
    },
  },
};

const subnets = {
  schema: {
    type: "array" as const,
    title: "Subnets",
    items: {
      type: "object" as const,
      properties: {
        az: {
          type: "string" as const,
          title: "Availability Zone",
          default: "",
          minLength: 1,
        },
        subnetId: {
          type: "string" as const,
          title: "Subnet ID",
          default: "",
          minLength: 1,
        },
      },
      required: ["az", "subnetId"],
    },
    default: [],
  },
  uiSchema: {
    "ui:addButtonText": "Add subnet",
    "ui:data-testid": "subnets-list",
    "ui:orderable": false,
    "ui:fullWidth": true,
    "ui:fieldCss": fullWidthCss,
    "ui:arrayItemCSS": arrayItemCSS,
    items: {
      "ui:label": false,
    },
  },
};

export const docker = {
  schema: {
    apiVersion: {
      type: "string" as const,
      title: "API Version",
      default: "",
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const aws = {
  schema: {
    subnets: subnets.schema,
    subnetTagName: {
      type: "string" as const,
      title: "Subnet Tag Name",
      default: "",
    },
    subnetTagValue: {
      type: "string" as const,
      title: "Subnet Tag Value",
      default: "",
    },
    accountRoles: accountRoles.schema,
    parameterStorePrefix: {
      type: "string" as const,
      title: "Parameter Store Prefix",
      default: "",
    },
    defaultSecurityGroup: {
      type: "string" as const,
      title: "Default Security Group",
      default: "",
    },
    maxVolumeSizePerUser: {
      type: "number" as const,
      title: "Total EBS Volume Size Per User",
      default: 0,
      minimum: 0,
    },
    allowedInstanceTypes: {
      type: "array" as const,
      title: "Allowed Instance Types",
      items: {
        type: "string" as const,
        minLength: 1,
      },
      default: [],
    },
    allowedRegions: {
      type: "array" as const,
      title: "Allowed Regions",
      items: {
        type: "string" as const,
        minLength: 1,
      },
      default: [],
    },
    alertableInstanceTypes: {
      type: "array" as const,
      title: "Alertable Instance Types",
      items: {
        type: "string" as const,
        minLength: 1,
      },
      default: [],
    },
    elasticIPUsageRate: {
      type: "number" as const,
      title: "Elastic IP Usage Rate",
      default: 0,
      minimum: 0,
    },
    ipamPoolID: {
      type: "string" as const,
      title: "IPAM Pool ID",
      default: "",
    },
    allowedSNSTopicARNs: {
      type: "array" as const,
      title: "Allowed SNS Topic ARNs",
      items: {
        type: "string" as const,
        minLength: 1,
      },
      default: [],
    },
    persistentDNS: {
      type: "object" as const,
      title: "Persistent DNS",
      properties: {
        hostedZoneID: {
          type: "string" as const,
          title: "Persistent DNS Hosted Zone ID",
          default: "",
        },
        domain: {
          type: "string" as const,
          title: "Persistent DNS Domain Name",
          default: "",
        },
      },
    },
    parserProject: {
      type: "object" as const,
      title: "Parser Project Settings",
      properties: {
        key: {
          type: "string" as const,
          title: "Parser Project S3 Key",
          default: "",
        },
        secret: {
          type: "string" as const,
          title: "Parser Project S3 Secret",
          default: "",
        },
        bucket: {
          type: "string" as const,
          title: "Parser Project S3 Bucket",
          default: "",
        },
        prefix: {
          type: "string" as const,
          title: "Parser Project S3 Prefix",
          default: "",
        },
        generatedJSONPrefix: {
          type: "string" as const,
          title: "Generated JSON Files S3 Prefix",
          default: "",
        },
      },
    },
    resourceTags: {
      type: "object" as const,
      title: "Resource Tags",
      description:
        "Configure supported tags for AWS resources created by Evergreen.",
      properties: {
        mongodbEnv: {
          type: "string" as const,
          title: "MongoDB Environment",
          oneOf: mongodbEnvironmentOptions.map(({ label, value }) => ({
            type: "string" as const,
            title: label,
            enum: [value],
          })),
        },
        mongodbOwner: {
          type: "string" as const,
          title: "MongoDB Owner Email",
          format: "validEmail",
        },
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:objectFieldCss": objectGridCss,
    "ui:data-testid": "aws-configuration",
    subnets: subnets.uiSchema,
    accountRoles: accountRoles.uiSchema,
    alertableInstanceTypes: {
      "ui:widget": widgets.ChipInputWidget,
    },
    allowedInstanceTypes: {
      "ui:widget": widgets.ChipInputWidget,
    },
    allowedRegions: {
      "ui:widget": widgets.ChipInputWidget,
    },
    allowedSNSTopicARNs: {
      "ui:widget": widgets.ChipInputWidget,
    },
    persistentDNS: {
      "ui:fieldCss": nestedObjectGridCss,
    },
    parserProject: {
      "ui:fieldCss": nestedObjectGridCss,
    },
    resourceTags: {
      "ui:fieldCss": nestedObjectGridCss,
      mongodbEnv: {
        "ui:allowDeselect": false,
      },
      mongodbOwner: {
        "ui:widget": widgets.TextWidget,
        "ui:options": {
          description:
            "An individual email is recommended for dev, demo, or sandbox. For all other environments, a Jira-referenceable team email is recommended.",
          inputType: "email",
        },
      },
    },
  },
};
