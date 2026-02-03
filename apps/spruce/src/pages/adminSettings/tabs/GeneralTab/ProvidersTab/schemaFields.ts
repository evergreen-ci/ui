import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import {
  EcsOperatingSystem,
  EcsWindowsVersion,
  EcsArchitecture,
} from "gql/generated/types";
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

const osOptions = [
  {
    type: "string" as const,
    title: "Linux",
    enum: [EcsOperatingSystem.EcsosLinux],
  },
  {
    type: "string" as const,
    title: "Windows",
    enum: [EcsOperatingSystem.EcsosWindows],
  },
];

const clusters = {
  schema: {
    type: "array" as const,
    title: "Pod ECS Clusters",
    items: {
      type: "object" as const,
      properties: {
        name: {
          type: "string" as const,
          title: "Name",
          default: "",
          minLength: 1,
        },
        os: {
          type: "string" as const,
          title: "OS",
          default: EcsOperatingSystem.EcsosLinux,
          oneOf: osOptions,
        },
      },
      required: ["name", "os"],
    },
    default: [],
  },
  uiSchema: {
    "ui:addButtonText": "Add cluster",
    "ui:data-cy": "clusters-list",
    "ui:orderable": false,
    "ui:fullWidth": true,
    "ui:fieldCss": fullWidthCss,
    "ui:arrayItemCSS": arrayItemCSS,
    items: {
      os: {
        "ui:allowDeselect": false,
      },
    },
  },
};

const archOptions = [
  {
    type: "string" as const,
    title: "amd64",
    enum: [EcsArchitecture.EcsArchAmd64],
  },
  {
    type: "string" as const,
    title: "arm64",
    enum: [EcsArchitecture.EcsArchArm64],
  },
];

const windowsOptions = [
  {
    type: "string" as const,
    title: "Server 2016",
    enum: [EcsWindowsVersion.EcsWindowsServer_2016],
  },
  {
    type: "string" as const,
    title: "Server 2019",
    enum: [EcsWindowsVersion.EcsWindowsServer_2019],
  },
  {
    type: "string" as const,
    title: "Server 2022",
    enum: [EcsWindowsVersion.EcsWindowsServer_2022],
  },
];

const capacityProviders = {
  schema: {
    type: "array" as const,
    title: "Pod ECS Capacity Providers",
    items: {
      type: "object" as const,
      properties: {
        name: {
          type: "string" as const,
          title: "Name",
          default: "",
          minLength: 1,
        },
        arch: {
          type: "string" as const,
          title: "Architecture",
          default: EcsArchitecture.EcsArchAmd64,
          oneOf: archOptions,
        },
        os: {
          type: "string" as const,
          title: "OS",
          default: EcsOperatingSystem.EcsosLinux,
          oneOf: osOptions,
        },
      },
      dependencies: {
        os: {
          oneOf: [
            {
              properties: {
                // Windows version is only required if OS is Windows.
                os: { enum: [EcsOperatingSystem.EcsosWindows] },
                windowsVersion: {
                  type: "string" as const,
                  title: "Windows Version",
                  oneOf: windowsOptions,
                  default: "",
                },
              },
            },
            {
              properties: {
                os: { enum: [EcsOperatingSystem.EcsosLinux] },
              },
            },
          ],
        },
      },
      required: ["name"],
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:addButtonText": "Add capacity provider",
    "ui:data-cy": "capacity-providers-list",
    "ui:orderable": false,
    "ui:fullWidth": true,
    "ui:fieldCss": fullWidthCss,
    "ui:arrayItemCSS": arrayItemCSS,
    items: {
      arch: {
        "ui:allowDeselect": false,
      },
      os: {
        "ui:allowDeselect": false,
      },
      windowsVersion: {
        "ui:allowDeselect": false,
      },
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
    pod: {
      type: "object" as const,
      title: "Pod ECS Settings",
      properties: {
        maxCPU: {
          type: "number" as const,
          title: "Pod ECS Max CPU Units Per Pod",
          default: 0,
          minimum: 0,
        },
        maxMemoryMb: {
          type: "number" as const,
          title: "Pod ECS Max Memory (MB) Per Pod",
          default: 0,
          minimum: 0,
        },
        role: {
          type: "string" as const,
          title: "Pod Role",
          default: "",
        },
        region: {
          type: "string" as const,
          title: "Pod Region",
          default: "",
        },
        podSecretManager: {
          type: "string" as const,
          title: "Pod Secret Manager Secret Prefix",
          default: "",
        },
        taskDefinitionPrefix: {
          type: "string" as const,
          title: "Pod Task Definition Prefix",
          default: "",
        },
        taskRole: {
          type: "string" as const,
          title: "Pod ECS Task Role",
          default: "",
        },
        executionRole: {
          type: "string" as const,
          title: "Pod ECS Execution Role",
          default: "",
        },
        logRegion: {
          type: "string" as const,
          title: "Pod ECS Log Region",
          default: "",
        },
        logGroup: {
          type: "string" as const,
          title: "Pod ECS Log Group",
          default: "",
        },
        logStreamPrefix: {
          type: "string" as const,
          title: "Pod ECS Log Stream Prefix",
          default: "",
        },
        allowedImages: {
          type: "array" as const,
          title: "Allowed Container Images",
          items: {
            type: "string" as const,
            minLength: 1,
          },
          default: [],
        },
        awsVPCSubnets: {
          type: "object" as const,
          title: "Pod ECS AWS VPC Subnets",
          properties: {
            subnets: {
              type: "array" as const,
              title: "Subnet IDs",
              items: {
                type: "string" as const,
                minLength: 1,
              },
              default: [],
            },
          },
        },
        awsVPCSecurityGroups: {
          type: "object" as const,
          title: "Pod ECS AWS VPC Security Groups",
          properties: {
            securityGroups: {
              type: "array" as const,
              title: "Security Group IDs",
              items: {
                type: "string" as const,
                minLength: 1,
              },
              default: [],
            },
          },
        },
        clusters: clusters.schema,
        capacityProviders: capacityProviders.schema,
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
    pod: {
      "ui:fieldCss": nestedObjectGridCss,
      allowedImages: {
        "ui:widget": widgets.ChipInputWidget,
        "ui:fieldCss": fullWidthCss,
      },
      awsVPCSubnets: {
        "ui:fieldCss": fullWidthCss,
        subnets: {
          "ui:widget": widgets.ChipInputWidget,
          "ui:elementWrapperCSS": css`
            margin-bottom: 0;
          `,
        },
      },
      awsVPCSecurityGroups: {
        "ui:fieldCss": fullWidthCss,
        securityGroups: {
          "ui:widget": widgets.ChipInputWidget,
          "ui:elementWrapperCSS": css`
            margin-bottom: 0;
          `,
        },
      },
      clusters: clusters.uiSchema,
      capacityProviders: capacityProviders.uiSchema,
    },
  },
};
