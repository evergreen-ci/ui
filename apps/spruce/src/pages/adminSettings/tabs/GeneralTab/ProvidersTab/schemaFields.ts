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
      default: [],
      items: {
        properties: {
          distro: {
            default: "",
            minLength: 1,
            title: "Distro",
            type: "string" as const,
          },
          id: {
            default: "",
            minLength: 1,
            title: "ID",
            type: "string" as const,
          },
          maxContainers: {
            default: 0,
            minimum: 0,
            title: "Max Containers",
            type: "number" as const,
          },
          port: {
            default: 0,
            maximum: 65535,
            minimum: 0,
            title: "Port",
            type: "number" as const,
          },
        },
        required: ["id", "distro"],
        type: "object" as const,
      },
      title: "",
      type: "array" as const,
    },
  },
  uiSchema: {
    pools: {
      "ui:addButtonText": "Add container pool",
      "ui:arrayItemCSS": arrayItemCSS,
      "ui:data-cy": "container-pools-list",
      "ui:fieldCss": fullWidthCss,
      "ui:fullWidth": true,
      "ui:orderable": false,
    },
    "ui:data-cy": "container-pools",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

const accountRoles = {
  schema: {
    default: [],
    items: {
      properties: {
        account: {
          default: "",
          minLength: 1,
          title: "Account",
          type: "string" as const,
        },
        role: {
          default: "",
          minLength: 1,
          title: "Role",
          type: "string" as const,
        },
      },
      required: ["account", "role"],
      type: "object" as const,
    },
    title: "Account Roles",
    type: "array" as const,
  },
  uiSchema: {
    "ui:addButtonText": "Add account role",
    "ui:arrayItemCSS": arrayItemCSS,
    "ui:data-cy": "account-roles-list",
    "ui:fieldCss": fullWidthCss,
    "ui:fullWidth": true,
    "ui:orderable": false,
  },
};

const subnets = {
  schema: {
    default: [],
    items: {
      properties: {
        az: {
          default: "",
          minLength: 1,
          title: "Availability Zone",
          type: "string" as const,
        },
        subnetId: {
          default: "",
          minLength: 1,
          title: "Subnet ID",
          type: "string" as const,
        },
      },
      required: ["az", "subnetId"],
      type: "object" as const,
    },
    title: "Subnets",
    type: "array" as const,
  },
  uiSchema: {
    "ui:addButtonText": "Add subnet",
    "ui:arrayItemCSS": arrayItemCSS,
    "ui:data-cy": "subnets-list",
    "ui:fieldCss": fullWidthCss,
    "ui:fullWidth": true,
    "ui:orderable": false,
  },
};

export const docker = {
  schema: {
    apiVersion: {
      default: "",
      title: "API Version",
      type: "string" as const,
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const aws = {
  schema: {
    accountRoles: accountRoles.schema,
    alertableInstanceTypes: {
      default: [],
      items: {
        minLength: 1,
        type: "string" as const,
      },
      title: "Alertable Instance Types",
      type: "array" as const,
    },
    allowedInstanceTypes: {
      default: [],
      items: {
        minLength: 1,
        type: "string" as const,
      },
      title: "Allowed Instance Types",
      type: "array" as const,
    },
    allowedRegions: {
      default: [],
      items: {
        minLength: 1,
        type: "string" as const,
      },
      title: "Allowed Regions",
      type: "array" as const,
    },
    defaultSecurityGroup: {
      default: "",
      title: "Default Security Group",
      type: "string" as const,
    },
    ec2Key: {
      default: "",
      title: "EC2 Key",
      type: "string" as const,
    },
    ec2Secret: {
      default: "",
      title: "EC2 Secret",
      type: "string" as const,
    },
    elasticIPUsageRate: {
      default: 0,
      minimum: 0,
      title: "Elastic IP Usage Rate",
      type: "number" as const,
    },
    ipamPoolID: {
      default: "",
      title: "IPAM Pool ID",
      type: "string" as const,
    },
    maxVolumeSizePerUser: {
      default: 0,
      minimum: 0,
      title: "Total EBS Volume Size Per User",
      type: "number" as const,
    },
    parameterStorePrefix: {
      default: "",
      title: "Parameter Store Prefix",
      type: "string" as const,
    },
    parserProject: {
      properties: {
        bucket: {
          default: "",
          title: "Parser Project S3 Bucket",
          type: "string" as const,
        },
        generatedJSONPrefix: {
          default: "",
          title: "Generated JSON Files S3 Prefix",
          type: "string" as const,
        },
        key: {
          default: "",
          title: "Parser Project S3 Key",
          type: "string" as const,
        },
        prefix: {
          default: "",
          title: "Parser Project S3 Prefix",
          type: "string" as const,
        },
        secret: {
          default: "",
          title: "Parser Project S3 Secret",
          type: "string" as const,
        },
      },
      title: "Parser Project Settings",
      type: "object" as const,
    },
    persistentDNS: {
      properties: {
        domain: {
          default: "",
          title: "Persistent DNS Domain Name",
          type: "string" as const,
        },
        hostedZoneID: {
          default: "",
          title: "Persistent DNS Hosted Zone ID",
          type: "string" as const,
        },
      },
      title: "Persistent DNS",
      type: "object" as const,
    },
    subnets: subnets.schema,
  },
  uiSchema: {
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
    parserProject: {
      "ui:fieldCss": nestedObjectGridCss,
    },
    persistentDNS: {
      "ui:fieldCss": nestedObjectGridCss,
    },
    subnets: subnets.uiSchema,
    "ui:data-cy": "aws-configuration",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};
