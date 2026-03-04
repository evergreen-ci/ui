import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import {
  gridWrapCss,
  fullWidthCss,
  objectGridCss,
  nestedObjectGridCss,
} from "../../sharedStyles";

const { gray } = palette;

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
    "ui:data-cy": "container-pools",
    "ui:objectFieldCss": objectGridCss,
    pools: {
      "ui:addButtonText": "Add container pool",
      "ui:data-cy": "container-pools-list",
      "ui:orderable": false,
      "ui:fullWidth": true,
      "ui:fieldCss": fullWidthCss,
      "ui:arrayItemCSS": arrayItemCSS,
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
    "ui:data-cy": "account-roles-list",
    "ui:orderable": false,
    "ui:fullWidth": true,
    "ui:fieldCss": fullWidthCss,
    "ui:arrayItemCSS": arrayItemCSS,
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
    "ui:data-cy": "subnets-list",
    "ui:orderable": false,
    "ui:fullWidth": true,
    "ui:fieldCss": fullWidthCss,
    "ui:arrayItemCSS": arrayItemCSS,
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
    accountRoles: accountRoles.schema,
    ec2Key: {
      type: "string" as const,
      title: "EC2 Key",
      default: "",
    },
    ec2Secret: {
      type: "string" as const,
      title: "EC2 Secret",
      default: "",
    },
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
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:objectFieldCss": objectGridCss,
    "ui:data-cy": "aws-configuration",
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
    persistentDNS: {
      "ui:fieldCss": nestedObjectGridCss,
    },
    parserProject: {
      "ui:fieldCss": nestedObjectGridCss,
    },
  },
};
