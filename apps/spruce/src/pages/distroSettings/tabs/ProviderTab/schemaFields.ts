import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { textAreaCSS, mergeCheckboxCSS, indentCSS } from "./styles";
import { BuildType } from "./types";

const userData = {
  schema: {
    type: "string" as const,
    title: "User Data",
  },
  uiSchema: {
    "ui:widget": "textarea",
    "ui:elementWrapperCSS": textAreaCSS,
    "ui:rows": 6,
  },
};

const mergeUserData = {
  schema: {
    type: "boolean" as const,
    title: "Merge with existing user data",
  },
  uiSchema: {
    "ui:elementWrapperCSS": mergeCheckboxCSS,
  },
};

const doNotAssignPublicIPv4Address = {
  schema: {
    type: "boolean" as const,
    title: "Do not assign public IPv4 address",
    default: false,
  },
  uiSchema: {
    "ui:bold": true,
    "ui:description": "Skip assigning a public IPv4 address to task hosts.",
  },
};

const securityGroups = {
  schema: {
    type: "array" as const,
    title: "Security Groups",
    items: {
      type: "string" as const,
      title: "Security Group ID",
      default: "",
      minLength: 1,
      pattern: "^sg-.*",
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add security group",
    "ui:orderable": false,
  },
};

const hosts = {
  schema: {
    type: "array" as const,
    title: "Hosts",
    items: {
      type: "object" as const,
      properties: {
        name: {
          type: "string" as const,
          title: "Name",
          minLength: 1,
        },
      },
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add host",
    "ui:orderable": false,
  },
};

const imageUrl = {
  schema: {
    type: "string" as const,
    title: "Docker Image URL",
    default: "",
    format: "validURL",
    minLength: 1,
  },
  uiSchema: {
    "ui:description": "Docker image URL to import on host machine.",
  },
};

const buildType = {
  schema: {
    type: "string" as const,
    title: "Image Build Method",
    default: BuildType.Import,
    oneOf: [
      {
        type: "string" as const,
        title: "Import",
        enum: [BuildType.Import],
      },
      {
        type: "string" as const,
        title: "Pull",
        enum: [BuildType.Pull],
      },
    ],
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const registryUsername = {
  schema: {
    type: "string" as const,
    title: "Username for Registries",
  },
  uiSchema: {
    "ui:optional": true,
  },
};

const registryPassword = {
  schema: { type: "string" as const, title: "Password for Registries" },
  uiSchema: {
    "ui:optional": true,
    "ui:inputType": "password",
  },
};

const amiId = {
  schema: {
    type: "string" as const,
    title: "EC2 AMI ID",
    default: "",
    minLength: 1,
  },
  uiSchema: {
    "ui:placeholder": "e.g. ami-1ecba176",
  },
};

const instanceType = {
  schema: {
    type: "string" as const,
    title: "Instance Type",
  },
  uiSchema: {
    "ui:description": "EC2 instance type for the AMI. Must be available.",
    "ui:placeholder": "e.g. t1.micro",
  },
};

const sshKeyName = {
  schema: {
    type: "string" as const,
    title: "SSH Key Name",
  },
  uiSchema: {
    "ui:description": "SSH key to add to the host machine.",
  },
};

const instanceProfileARN = {
  schema: {
    type: "string" as const,
    title: "IAM Instance Profile ARN",
  },
  uiSchema: {
    "ui:description": "The Amazon Resource Name (ARN) of the instance profile.",
  },
};

const vpcOptions = {
  schema: {
    type: "object" as const,
    title: "",
    properties: {
      useVpc: {
        type: "boolean" as const,
        title: "Use security groups in an EC2 VPC",
        default: false,
      },
    },
    dependencies: {
      useVpc: {
        oneOf: [
          {
            properties: {
              useVpc: {
                enum: [true],
              },
              subnetId: {
                type: "string" as const,
                title: "Default VPC Subnet ID",
                default: "",
                minLength: 1,
                pattern: "^subnet-.*",
              },
              subnetPrefix: {
                type: "string" as const,
                title: "VPC Subnet Prefix",
                default: "",
              },
            },
          },
          {
            properties: {
              useVpc: {
                enum: [false],
              },
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    useVpc: {
      "ui:data-cy": "use-vpc",
    },
    subnetId: {
      "ui:placeholder": "e.g. subnet-xxxx",
      "ui:elementWrapperCSS": indentCSS,
    },
    subnetPrefix: {
      "ui:description":
        "Looks for subnets like <prefix>.subnet_1a, <prefix>.subnet_1b, etc.",
      "ui:elementWrapperCSS": indentCSS,
      "ui:optional": true,
    },
  },
};

const mountPoints = {
  schema: {
    type: "array" as const,
    title: "Mount Points",
    items: {
      type: "object" as const,
      properties: {
        deviceName: {
          type: "string" as const,
          title: "Device Name",
          default: "",
          minLength: 1,
        },
        virtualName: {
          type: "string" as const,
          title: "Virtual Name",
        },
        volumeType: {
          type: "string" as const,
          title: "Volume Type",
        },
        iops: {
          type: "number" as const,
          title: "IOPS",
        },
        throughput: {
          type: "number" as const,
          title: "Throughput (MiB/s)",
        },
        size: {
          type: "number" as const,
          title: "Size (GB)",
        },
      },
    },
  },
  uiSchema: {
    "ui:data-cy": "mount-points",
    "ui:addButtonText": "Add mount point",
    "ui:orderable": false,
    "ui:topAlignDelete": true,
    items: {
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
      "ui:defaultOpen": true,
      "ui:numberedTitle": "Mount Point",
    },
  },
};

export const staticProviderSettings = {
  schema: {
    mergeUserData: mergeUserData.schema,
    userData: userData.schema,
    securityGroups: securityGroups.schema,
    hosts: hosts.schema,
  },
  uiSchema: {
    mergeUserData: mergeUserData.uiSchema,
    userData: userData.uiSchema,
    securityGroups: securityGroups.uiSchema,
    hosts: hosts.uiSchema,
  },
};

export const dockerProviderSettings = {
  schema: {
    buildType: buildType.schema,
    imageUrl: imageUrl.schema,
    registryUsername: registryUsername.schema,
    registryPassword: registryPassword.schema,
    mergeUserData: mergeUserData.schema,
    userData: userData.schema,
    securityGroups: securityGroups.schema,
  },
  uiSchema: {
    buildType: buildType.uiSchema,
    imageUrl: imageUrl.uiSchema,
    registryUsername: registryUsername.uiSchema,
    registryPassword: registryPassword.uiSchema,
    mergeUserData: mergeUserData.uiSchema,
    userData: userData.uiSchema,
    securityGroups: securityGroups.uiSchema,
  },
};

export const ec2FleetProviderSettings = {
  schema: {
    amiId: amiId.schema,
    instanceType: instanceType.schema,
    sshKeyName: sshKeyName.schema,
    instanceProfileARN: instanceProfileARN.schema,
    doNotAssignPublicIPv4Address: doNotAssignPublicIPv4Address.schema,
    mergeUserData: mergeUserData.schema,
    userData: userData.schema,
    securityGroups: securityGroups.schema,
    vpcOptions: vpcOptions.schema,
    mountPoints: mountPoints.schema,
  },
  uiSchema: {
    amiId: amiId.uiSchema,
    instanceType: instanceType.uiSchema,
    sshKeyName: sshKeyName.uiSchema,
    instanceProfileARN: instanceProfileARN.uiSchema,
    doNotAssignPublicIPv4Address: doNotAssignPublicIPv4Address.uiSchema,
    mergeUserData: mergeUserData.uiSchema,
    userData: userData.uiSchema,
    securityGroups: securityGroups.uiSchema,
    vpcOptions: vpcOptions.uiSchema,
    mountPoints: mountPoints.uiSchema,
  },
};

export const ec2OnDemandProviderSettings = {
  schema: {
    amiId: amiId.schema,
    instanceType: instanceType.schema,
    sshKeyName: sshKeyName.schema,
    instanceProfileARN: instanceProfileARN.schema,
    doNotAssignPublicIPv4Address: doNotAssignPublicIPv4Address.schema,
    mergeUserData: mergeUserData.schema,
    userData: userData.schema,
    securityGroups: securityGroups.schema,
    vpcOptions: vpcOptions.schema,
    mountPoints: mountPoints.schema,
  },
  uiSchema: {
    amiId: amiId.uiSchema,
    instanceType: instanceType.uiSchema,
    sshKeyName: sshKeyName.uiSchema,
    instanceProfileARN: instanceProfileARN.uiSchema,
    doNotAssignPublicIPv4Address: doNotAssignPublicIPv4Address.uiSchema,
    mergeUserData: mergeUserData.uiSchema,
    userData: userData.uiSchema,
    securityGroups: securityGroups.uiSchema,
    vpcOptions: vpcOptions.uiSchema,
    mountPoints: mountPoints.uiSchema,
  },
};

export const ec2ProviderAccountField = {
  type: "string" as const,
  title: "Provider Account",
  default: "",
};
