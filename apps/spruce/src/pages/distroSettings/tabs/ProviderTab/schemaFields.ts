import { css } from "@emotion/react";
import { size } from "@evg-ui/lib/constants/tokens";
import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { textAreaCSS, mergeCheckboxCSS, indentCSS } from "./styles";
import { BuildType } from "./types";

const userData = {
  schema: {
    title: "User Data",
    type: "string" as const,
  },
  uiSchema: {
    "ui:elementWrapperCSS": textAreaCSS,
    "ui:rows": 6,
    "ui:widget": "textarea",
  },
};

const mergeUserData = {
  schema: {
    title: "Merge with existing user data",
    type: "boolean" as const,
  },
  uiSchema: {
    "ui:elementWrapperCSS": mergeCheckboxCSS,
  },
};

const doNotAssignPublicIPv4Address = {
  schema: {
    default: false,
    title: "Do not assign public IPv4 address",
    type: "boolean" as const,
  },
  uiSchema: {
    "ui:bold": true,
    "ui:description": "Skip assigning a public IPv4 address to task hosts.",
  },
};

const elasticIpsEnabled = {
  schema: {
    default: false,
    title: "Enable Elastic IPs",
    type: "boolean" as const,
  },
  uiSchema: {
    "ui:bold": true,
    "ui:description": "Use elastic IPs instead of AWS-provided IPs",
  },
};

const securityGroups = {
  schema: {
    items: {
      default: "",
      minLength: 1,
      pattern: "^(s|sg|sg-.*)?$",
      title: "Security Group ID",
      type: "string" as const,
    },
    title: "Security Groups",
    type: "array" as const,
  },
  uiSchema: {
    items: {
      "ui:placeholder": "e.g. sg-xxxx",
    },
    "ui:addButtonText": "Add security group",
    "ui:orderable": false,
  },
};

const hosts = {
  schema: {
    items: {
      properties: {
        name: {
          minLength: 1,
          title: "Name",
          type: "string" as const,
        },
      },
      type: "object" as const,
    },
    title: "Hosts",
    type: "array" as const,
  },
  uiSchema: {
    "ui:addButtonText": "Add host",
    "ui:orderable": false,
  },
};

const imageUrl = {
  schema: {
    default: "",
    format: "validURL",
    minLength: 1,
    title: "Docker Image URL",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description": "Docker image URL to import on host machine.",
  },
};

const buildType = {
  schema: {
    default: BuildType.Import,
    oneOf: [
      {
        enum: [BuildType.Import],
        title: "Import",
        type: "string" as const,
      },
      {
        enum: [BuildType.Pull],
        title: "Pull",
        type: "string" as const,
      },
    ],
    title: "Image Build Method",
    type: "string" as const,
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const registryUsername = {
  schema: {
    title: "Username for Registries",
    type: "string" as const,
  },
  uiSchema: {
    "ui:optional": true,
  },
};

const registryPassword = {
  schema: { title: "Password for Registries", type: "string" as const },
  uiSchema: {
    "ui:inputType": "password",
    "ui:optional": true,
  },
};

const amiId = {
  schema: {
    default: "",
    minLength: 1,
    title: "EC2 AMI ID",
    type: "string" as const,
  },
  uiSchema: {
    "ui:placeholder": "e.g. ami-1ecba176",
  },
};

const instanceType = {
  schema: {
    title: "Instance Type",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description": "EC2 instance type for the AMI. Must be available.",
    "ui:placeholder": "e.g. t1.micro",
  },
};

const sshKeyName = {
  schema: {
    title: "SSH Key Name",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description": "SSH key to add to the host machine.",
  },
};

const instanceProfileARN = {
  schema: {
    default: "",
    pattern: "^(a|ar|arn|arn:.*)?$",
    title: "IAM Instance Profile ARN",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description": "The Amazon Resource Name (ARN) of the instance profile.",
    "ui:placeholder":
      "e.g. arn:aws:iam::123456789012:instance-profile/MyProfile",
  },
};

const vpcOptions = {
  schema: {
    dependencies: {
      useVpc: {
        oneOf: [
          {
            properties: {
              subnetId: {
                default: "",
                minLength: 1,
                pattern: "^subnet-.*",
                title: "Default VPC Subnet ID",
                type: "string" as const,
              },
              subnetPrefix: {
                default: "",
                title: "VPC Subnet Prefix",
                type: "string" as const,
              },
              useVpc: {
                enum: [true],
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
    properties: {
      useVpc: {
        default: false,
        title: "Use security groups in an EC2 VPC",
        type: "boolean" as const,
      },
    },
    title: "",
    type: "object" as const,
  },
  uiSchema: {
    subnetId: {
      "ui:elementWrapperCSS": indentCSS,
      "ui:placeholder": "e.g. subnet-xxxx",
    },
    subnetPrefix: {
      "ui:description":
        "Looks for subnets like <prefix>.subnet_1a, <prefix>.subnet_1b, etc.",
      "ui:elementWrapperCSS": indentCSS,
      "ui:optional": true,
    },
    useVpc: {
      "ui:data-cy": "use-vpc",
    },
  },
};

const mountPoints = {
  schema: {
    items: {
      properties: {
        deviceName: {
          default: "",
          minLength: 1,
          title: "Device Name",
          type: "string" as const,
        },
        iops: {
          title: "IOPS",
          type: "number" as const,
        },
        size: {
          title: "Size (GB)",
          type: "number" as const,
        },
        throughput: {
          title: "Throughput (MiB/s)",
          type: "number" as const,
        },
        virtualName: {
          title: "Virtual Name",
          type: "string" as const,
        },
        volumeType: {
          title: "Volume Type",
          type: "string" as const,
        },
      },
      type: "object" as const,
    },
    title: "Mount Points",
    type: "array" as const,
  },
  uiSchema: {
    items: {
      "ui:defaultOpen": true,
      "ui:numberedTitle": "Mount Point",
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
    },
    "ui:addButtonText": "Add mount point",
    "ui:data-cy": "mount-points",
    "ui:orderable": false,
    "ui:topAlignDelete": true,
  },
};

export const staticProviderSettings = {
  schema: {
    hosts: hosts.schema,
    mergeUserData: mergeUserData.schema,
    securityGroups: securityGroups.schema,
    userData: userData.schema,
  },
  uiSchema: {
    hosts: hosts.uiSchema,
    mergeUserData: mergeUserData.uiSchema,
    securityGroups: securityGroups.uiSchema,
    userData: userData.uiSchema,
  },
};

export const dockerProviderSettings = {
  schema: {
    buildType: buildType.schema,
    imageUrl: imageUrl.schema,
    mergeUserData: mergeUserData.schema,
    registryPassword: registryPassword.schema,
    registryUsername: registryUsername.schema,
    securityGroups: securityGroups.schema,
    userData: userData.schema,
  },
  uiSchema: {
    buildType: buildType.uiSchema,
    imageUrl: imageUrl.uiSchema,
    mergeUserData: mergeUserData.uiSchema,
    registryPassword: registryPassword.uiSchema,
    registryUsername: registryUsername.uiSchema,
    securityGroups: securityGroups.uiSchema,
    userData: userData.uiSchema,
  },
};

export const ec2FleetProviderSettings = {
  schema: {
    amiId: amiId.schema,
    doNotAssignPublicIPv4Address: doNotAssignPublicIPv4Address.schema,
    elasticIpsEnabled: elasticIpsEnabled.schema,
    instanceProfileARN: instanceProfileARN.schema,
    instanceType: instanceType.schema,
    mergeUserData: mergeUserData.schema,
    mountPoints: mountPoints.schema,
    securityGroups: securityGroups.schema,
    sshKeyName: sshKeyName.schema,
    userData: userData.schema,
    vpcOptions: vpcOptions.schema,
  },
  uiSchema: {
    amiId: amiId.uiSchema,
    doNotAssignPublicIPv4Address: doNotAssignPublicIPv4Address.uiSchema,
    elasticIpsEnabled: elasticIpsEnabled.uiSchema,
    instanceProfileARN: instanceProfileARN.uiSchema,
    instanceType: instanceType.uiSchema,
    mergeUserData: mergeUserData.uiSchema,
    mountPoints: mountPoints.uiSchema,
    securityGroups: securityGroups.uiSchema,
    sshKeyName: sshKeyName.uiSchema,
    userData: userData.uiSchema,
    vpcOptions: vpcOptions.uiSchema,
  },
};

export const ec2ProviderAccountField = {
  default: "",
  title: "Provider Account",
  type: "string" as const,
};

export const taskHostOverridesFields = {
  schema: {
    dependencies: {
      enableTaskHostOverrides: {
        oneOf: [
          {
            properties: {
              enableTaskHostOverrides: {
                enum: [false],
              },
            },
          },
          {
            properties: {
              doNotAssignPublicIpv4Address: doNotAssignPublicIPv4Address.schema,
              enableTaskHostOverrides: {
                enum: [true],
              },
              iamInstanceProfileArn: instanceProfileARN.schema,
              providerAccount: ec2ProviderAccountField,
              securityGroupIds: securityGroups.schema,
              subnetId: {
                default: "",
                pattern: "^(s|su|sub|subn|subne|subnet|subnet-.*)?$",
                title: "Subnet ID",
                type: "string" as const,
              },
            },
          },
        ],
      },
    },
    properties: {
      enableTaskHostOverrides: {
        default: false,
        title: "Enable task host overrides",
        type: "boolean" as const,
      },
    },
    title: "Task Host Overrides",
    type: "object" as const,
  },
  uiSchema: {
    doNotAssignPublicIpv4Address: doNotAssignPublicIPv4Address.uiSchema,
    enableTaskHostOverrides: {
      "ui:data-cy": "enable-task-host-overrides",
      "ui:description":
        "When enabled, the values below replace the distro's provider settings for task hosts. Empty values override the distro's settings rather than falling back to them. To remove the overrides, toggle off and save.",
      "ui:elementWrapperCSS": css`
        &:last-child {
          margin-bottom: 0;
        }
      `,
      "ui:widget": widgets.ToggleWidget,
    },
    iamInstanceProfileArn: instanceProfileARN.uiSchema,
    providerAccount: {
      "ui:elementWrapperCSS": css`
        margin-top: ${size.s};
      `,
    },
    securityGroupIds: securityGroups.uiSchema,
    subnetId: {
      "ui:placeholder": "e.g. subnet-xxxx",
    },
  },
};
