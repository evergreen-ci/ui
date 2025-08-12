import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import {
  EcsOperatingSystem,
  EcsWindowsVersion,
  EcsArchitecture,
} from "gql/generated/types";
import { gridWrapCss, fullWidthCss, objectGridCss } from "../../sharedStyles";

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
      title: "Container Pools",
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
          enum: Object.values(EcsOperatingSystem),
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
  },
};

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
          enum: Object.values(EcsArchitecture),
          default: [EcsArchitecture.EcsArchAmd64],
        },
        os: {
          type: "string" as const,
          title: "OS",
          default: EcsOperatingSystem.EcsosLinux,
          enum: Object.values(EcsOperatingSystem),
        },
        windowsVersion: {
          type: "string" as const,
          title: "Windows Version",
          default: "",
          enum: Object.values(EcsWindowsVersion),
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
  },
};

export const repoExceptions = {
  schema: {
    repos: {
      type: "array" as const,
      title: "Repository Exceptions",
      items: {
        type: "object" as const,
        properties: {
          owner: {
            type: "string" as const,
            title: "Owner",
            default: "",
          },
          repo: {
            type: "string" as const,
            title: "Repository",
            default: "",
          },
        },
        required: ["owner", "repo"],
      },
      default: [],
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:objectFieldCss": fullWidthCss,
    "ui:data-cy": "repo-exceptions",
    repos: {
      "ui:addButtonText": "Add repository exception",
      "ui:orderable": false,
      "ui:data-cy": "repo-exceptions",
      "ui:fullWidth": true,
      "ui:fieldCss": fullWidthCss,
      "ui:arrayItemCSS": arrayItemCSS,
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

const docker = {
  schema: {
    type: "object" as const,
    title: "Docker Configuration",
    properties: {
      apiVersion: {
        type: "string" as const,
        title: "API Version",
        default: "",
      },
    },
  },
  uiSchema: {
    "ui:fieldCss": css`
      ${fullWidthCss}
      border: 1px solid ${gray.light2};
      border-radius: ${size.s};
      padding: ${size.m};
      margin-bottom: ${size.m};
    `,
  },
};

export const aws = {
  schema: {
    subnets: subnets.schema,
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

    parserProjectS3Key: {
      type: "string" as const,
      title: "Parser Project S3 Key",
      default: "",
    },
    parserProjectS3Secret: {
      type: "string" as const,
      title: "Parser Project S3 Secret",
      default: "",
    },
    parserProjectS3Bucket: {
      type: "string" as const,
      title: "Parser Project S3 Bucket",
      default: "",
    },
    parserProjectS3Prefix: {
      type: "string" as const,
      title: "Parser Project S3 Prefix",
      default: "",
    },
    persistentDNSHostedZoneId: {
      type: "string" as const,
      title: "Persistent DNS Hosted Zone ID",
      default: "",
    },
    persistentDNSDomainName: {
      type: "string" as const,
      title: "Persistent DNS Domain Name",
      default: "",
    },
    generatedJsonFilesS3Prefix: {
      type: "string" as const,
      title: "Generated JSON Files S3 Prefix",
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
    allowedImages: {
      type: "array" as const,
      title: "Allowed Container Images",
      items: {
        type: "string" as const,
        minLength: 1,
      },
      default: [],
    },
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
    accountRoles: accountRoles.schema,
    awsVPCSubnets: {
      type: "object" as const,
      title: "POD ECS AWSVPC Subnets",
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
      title: "POD ECS AWSVPC Security Groups",
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
    docker: docker.schema,
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
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:objectFieldCss": objectGridCss,
    "ui:data-cy": "aws-configuration",
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
    allowedImages: {
      "ui:widget": widgets.ChipInputWidget,
    },
    clusters: clusters.uiSchema,
    capacityProviders: capacityProviders.uiSchema,
    awsVPCSubnets: {
      "ui:fieldCss": fullWidthCss,
      subnets: {
        "ui:widget": widgets.ChipInputWidget,
      },
    },
    awsVPCSecurityGroups: {
      "ui:fieldCss": fullWidthCss,
      securityGroups: {
        "ui:widget": widgets.ChipInputWidget,
      },
    },
    subnets: subnets.uiSchema,
    docker: docker.uiSchema,
  },
};
