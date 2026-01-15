import { css } from "@emotion/react";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { InlineCode } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import {
  CardFieldTemplate,
  AccordionFieldTemplate,
  FieldRow,
} from "components/SpruceForm/FieldTemplates";
import { Arch } from "gql/generated/types";
import {
  architectureToCopy,
  bootstrapMethodToCopy,
  communicationMethodToCopy,
  feedbackRuleToCopy,
  hostAllocatorVersionToCopy,
  linuxArchitectures,
  overallocatedRuleToCopy,
  roundingRuleToCopy,
  windowsArchitectures,
} from "./constants";

const indentCSS = css`
  margin-left: ${size.m};
`;

const enumSelect = (enumObject: Record<string, string>) =>
  Object.entries(enumObject).map(([key, title]) => ({
    type: "string" as const,
    title,
    enum: [key],
  }));

const bootstrapMethod = {
  schema: {
    type: "string" as const,
    title: "Host Bootstrap Method",
    oneOf: enumSelect(bootstrapMethodToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const communicationMethod = {
  schema: {
    type: "string" as const,
    title: "Host Communication Method",
    oneOf: enumSelect(communicationMethodToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const arch = {
  schema: {
    type: "string" as const,
    title: "Agent Architecture",
    oneOf: enumSelect(architectureToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const workDir = {
  schema: {
    type: "string" as const,
    title: "Working Directory",
    minLength: 1,
  },
  uiSchema: {
    "ui:description":
      "Absolute path in which the agent run tasks on the host machine",
  },
};

const setupAsSudo = {
  schema: {
    type: "boolean" as const,
    title: "Run script as sudo",
  },
  uiSchema: {
    "ui:elementWrapperCSS": css`
      display: flex;
      justify-content: flex-end;
      margin-bottom: -20px;
    `,
  },
};

const setupScript = {
  schema: {
    type: "string" as const,
    title: "Setup Script",
  },
  uiSchema: {
    "ui:elementWrapperCSS": css`
      textarea {
        font-family: ${fontFamilies.code};
      }
    `,
    "ui:rows": 8,
    "ui:widget": "textarea",
  },
};

const userSpawnAllowed = {
  schema: {
    type: "boolean" as const,
    title: "Spawnable",
  },
  uiSchema: (hasStaticProvider: boolean) => ({
    ...(hasStaticProvider && {
      "ui:disabled": true,
      "ui:tooltipDescription": "Static distros are not spawnable.",
    }),
    "ui:description": "Allow users to spawn these hosts for personal use.",
    "ui:bold": true,
  }),
};

export const isVirtualWorkStation = {
  schema: {
    type: "boolean" as const,
    title: "Virtual Workstations",
  },
  uiSchema: (architecture: Arch) => ({
    ...(!linuxArchitectures.includes(architecture) && {
      "ui:disabled": true,
      "ui:tooltipDescription":
        "Only Linux distros may be configured as virtual workstations.",
    }),

    "ui:description":
      "Allow spawned hosts of this distro to be used as virtual workstations.",
    "ui:bold": true,
  }),
};

export const icecreamSchedulerHost = {
  schema: {
    type: "string" as const,
    title: "Icecream Scheduler Host",
  },
  uiSchema: {
    "ui:description": "Host name to connect to the icecream scheduler",
    "ui:elementWrapperCSS": indentCSS,
  },
};

export const icecreamConfigPath = {
  schema: {
    type: "string" as const,
    title: "Icecream Config File Path",
  },
  uiSchema: {
    "ui:description": "Path to the icecream config file",
    "ui:elementWrapperCSS": indentCSS,
  },
};

export const rootDir = {
  schema: {
    type: "string" as const,
    title: "Root Directory",
  },
  uiSchema: {},
};

export const mountpoints = {
  schema: {
    type: "array" as const,
    title: "Mountpoints",
    items: {
      type: "string" as const,
      title: "Mountpoint",
      default: "",
      minLength: 1,
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add mountpoint",
    "ui:description": "Mointpoints configured on the host.",
    "ui:orderable": false,
    items: {
      "ui:placeholder": "/data",
    },
  },
};

const serviceUser = {
  schema: {
    type: "string" as const,
    title: "Service User",
  },
  uiSchema: (architecture: Arch) => ({
    "ui:description": "Username for setting up Evergreen services",
    // Only visible for Windows
    ...(!windowsArchitectures.includes(architecture) && {
      "ui:widget": "hidden",
    }),
  }),
};

const jasperBinaryDir = {
  schema: {
    type: "string" as const,
    title: "Jasper Binary Directory",
    minLength: 1,
  },
  uiSchema: {
    "ui:description":
      "Absolute native path to the directory containing the Jasper binary",
  },
};

export const jasperCredentialsPath = {
  schema: {
    type: "string" as const,
    title: "Jasper Credentials Path",
    minLength: 1,
  },
  uiSchema: {
    "ui:description":
      "Absolute native path to the directory containing the Jasper credentials",
  },
};

const clientDir = {
  schema: {
    type: "string" as const,
    title: "Client Directory",
    minLength: 1,
  },
  uiSchema: {
    "ui:description":
      "Absolute native path to the directory containing the evergreen binary",
  },
};

const shellPath = {
  schema: {
    type: "string" as const,
    title: "Shell Path",
    minLength: 1,
  },
  uiSchema: {
    "ui:description": "Absolute native path to the shell binary file (bash)",
  },
};

const homeVolumeFormatCommand = {
  schema: {
    type: "string" as const,
    title: "Home Volume Format Command",
  },
  uiSchema: {},
};

const numFiles = {
  schema: {
    type: "number" as const,
    title: "Number of Files",
    minimum: -1,
  },
  uiSchema: {
    "ui:description": "Max number of open file handles. Set -1 for unlimited.",
  },
};

const numTasks = {
  schema: {
    type: "number" as const,
    title: "Number of CGroup Tasks",
    minimum: -1,
  },
  uiSchema: {
    "ui:description":
      "Max number of cgroup tasks (threads). Set -1 for unlimited.",
  },
};

const numProcesses = {
  schema: {
    type: "number" as const,
    title: "Number of Processes",
    minimum: -1,
  },
  uiSchema: {
    "ui:description": "Max number of processes. Set -1 for unlimited.",
  },
};

const lockedMemoryKb = {
  schema: {
    type: "number" as const,
    title: "Locked Memory",
    minimum: -1,
  },
  uiSchema: {
    "ui:description":
      "Max size (kB) that can be locked into memory. Set -1 for unlimited.",
  },
};

const virtualMemoryKb = {
  schema: {
    type: "number" as const,
    title: "Virtual Memory",
    minimum: -1,
  },
  uiSchema: {
    "ui:description":
      "Max size (kB) of available virtual memory. Set -1 for unlimited.",
  },
};

const env = {
  schema: {
    type: "array" as const,
    title: "Environment Variables",
    items: {
      type: "object" as const,
      properties: {
        key: {
          type: "string" as const,
          title: "Key",
          default: "",
          minLength: 1,
        },
        value: {
          type: "string" as const,
          title: "Value",
          default: "",
          minLength: 1,
        },
      },
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add variable",
    "ui:fullWidth": true,
    "ui:orderable": false,
    items: {
      "ui:ObjectFieldTemplate": FieldRow,
    },
  },
};

const preconditionScripts = {
  schema: {
    type: "array" as const,
    title: "Precondition Scripts",
    items: {
      type: "object" as const,
      properties: {
        path: {
          type: "string" as const,
          title: "Path",
          default: "",
          minLength: 1,
        },
        script: {
          type: "string" as const,
          title: "Script",
          default: "",
          minLength: 1,
        },
      },
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add script",
    "ui:fullWidth": true,
    "ui:orderable": false,
    "ui:topAlignDelete": true,
    items: {
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
      "ui:numberedTitle": "Precondition Script",
      path: {
        "ui:description": "Absolute path where the script will be placed.",
      },
      script: {
        "ui:description":
          "The precondition script that must run and succeed before Jasper can start.",
        "ui:elementWrapperCSS": css`
          textarea {
            font-family: ${fontFamilies.code};
          }
        `,
        "ui:rows": 8,
        "ui:widget": "textarea",
      },
    },
  },
};

const user = {
  schema: {
    type: "string" as const,
    title: "SSH User",
    minLength: 1,
  },
  uiSchema: {
    "ui:description": "Username with which to SSH into the host machine.",
  },
};

const execUser = {
  schema: {
    type: "string" as const,
    title: "Exec User",
  },
  uiSchema: {
    "ui:description": (
      <>
        User that runs <InlineCode>shell.exec</InlineCode> and{" "}
        <InlineCode>subprocess.exec</InlineCode> processes. If unset, processes
        are run by the SSH User.
      </>
    ),
  },
};

const authorizedKeysFile = {
  schema: {
    type: "string" as const,
    title: "Authorized Keys File",
  },
  uiSchema: (hasStaticProvider: boolean) => ({
    "ui:data-cy": "authorized-keys-input",
    "ui:description": "Path to file containing authorized SSH keys",
    "ui:placeholder": "~/.ssh/authorized_keys",
    ...(!hasStaticProvider && { "ui:widget": "hidden" }),
  }),
};

const sshOptions = {
  schema: {
    type: "array" as const,
    title: "SSH Options",
    items: {
      type: "string" as const,
      title: "SSH Option",
      default: "",
      minLength: 1,
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add SSH option",
    "ui:description": (
      <>
        Specify option keywords supported by <InlineCode>ssh_config</InlineCode>
        .
      </>
    ),
    "ui:orderable": false,
    items: {
      "ui:placeholder": "ConnectTimeout=10",
    },
  },
};

const version = {
  schema: {
    type: "string" as const,
    title: "Host Allocator Version",
    oneOf: enumSelect(hostAllocatorVersionToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const roundingRule = {
  schema: {
    type: "string" as const,
    title: "Host Allocator Rounding Rule",
    oneOf: enumSelect(roundingRuleToCopy),
  },
  uiSchema: (hasStaticProvider: boolean) => ({
    "ui:allowDeselect": false,
    "ui:data-cy": "rounding-rule-select",
    ...(hasStaticProvider && { "ui:widget": "hidden" }),
  }),
};

const feedbackRule = {
  schema: {
    type: "string" as const,
    title: "Host Allocator Feedback Rule",
    oneOf: enumSelect(feedbackRuleToCopy),
  },
  uiSchema: (hasStaticProvider: boolean) => ({
    "ui:allowDeselect": false,
    "ui:data-cy": "feedback-rule-select",
    ...(hasStaticProvider && { "ui:widget": "hidden" }),
  }),
};

const hostsOverallocatedRule = {
  schema: {
    type: "string" as const,
    title: "Host Overallocation Rule",
    oneOf: enumSelect(overallocatedRuleToCopy),
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const autoTuneMaximumHosts = {
  schema: {
    type: "boolean" as const,
    title: "Auto Tune Maximum Hosts",
    default: false,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:description":
      "Automatically adjust max hosts according to recent host usage.",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

const minimumHosts = {
  schema: {
    type: "number" as const,
    title: "Minimum Number of Hosts Allowed",
    minimum: 0,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "minimum-hosts-input",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

const maximumHosts = {
  schema: {
    type: "number" as const,
    title: "Maximum Number of Hosts Allowed",
    minimum: 0,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "maximum-hosts-input",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

const acceptableHostIdleTime = {
  schema: {
    type: "number" as const,
    title: "Acceptable Host Idle Time (ms)",
    minimum: 0,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "idle-time-input",
    "ui:description": "Set 0 to use global default.",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

const futureHostFraction = {
  schema: {
    type: "number" as const,
    title: "Future Host Fraction",
    minimum: 0,
    maximum: 1,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "future-fraction-input",
    "ui:description": "Set 0 to use global default.",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

export const setup = {
  schema: {
    bootstrapMethod: bootstrapMethod.schema,
    communicationMethod: communicationMethod.schema,
    arch: arch.schema,
    workDir: workDir.schema,
    setupAsSudo: setupAsSudo.schema,
    setupScript: setupScript.schema,
    mountpoints: mountpoints.schema,
    userSpawnAllowed: userSpawnAllowed.schema,
  },
  uiSchema: (architecture: Arch, hasStaticProvider: boolean) => ({
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    bootstrapMethod: bootstrapMethod.uiSchema,
    communicationMethod: communicationMethod.uiSchema,
    arch: arch.uiSchema,
    setupAsSudo: setupAsSudo.uiSchema,
    workDir: workDir.uiSchema,
    setupScript: setupScript.uiSchema,
    mountpoints: mountpoints.uiSchema,
    userSpawnAllowed: userSpawnAllowed.uiSchema(hasStaticProvider),
    isVirtualWorkStation: isVirtualWorkStation.uiSchema(architecture),
    icecreamSchedulerHost: icecreamSchedulerHost.uiSchema,
    icecreamConfigPath: icecreamConfigPath.uiSchema,
  }),
};

export const bootstrap = {
  schema: {
    jasperBinaryDir: jasperBinaryDir.schema,
    jasperCredentialsPath: jasperCredentialsPath.schema,
    clientDir: clientDir.schema,
    shellPath: shellPath.schema,
    homeVolumeFormatCommand: homeVolumeFormatCommand.schema,
    serviceUser: serviceUser.schema,
    resourceLimits: {
      type: "object" as const,
      title: "Resource Limits",
      required: [
        "numFiles",
        "numTasks",
        "numProcesses",
        "lockedMemoryKb",
        "virtualMemoryKb",
      ],
      properties: {
        numFiles: numFiles.schema,
        numTasks: numTasks.schema,
        numProcesses: numProcesses.schema,
        lockedMemoryKb: lockedMemoryKb.schema,
        virtualMemoryKb: virtualMemoryKb.schema,
      },
    },
    env: env.schema,
    preconditionScripts: preconditionScripts.schema,
  },
  uiSchema: (architecture: Arch) => ({
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    serviceUser: serviceUser.uiSchema(architecture),
    jasperBinaryDir: jasperBinaryDir.uiSchema,
    jasperCredentialsPath: jasperCredentialsPath.uiSchema,
    clientDir: clientDir.uiSchema,
    shellPath: shellPath.uiSchema,
    resourceLimits: {
      // Only visible for Linux
      ...(!linuxArchitectures.includes(architecture) && {
        "ui:widget": "hidden",
      }),
      numFiles: numFiles.uiSchema,
      numTasks: numTasks.uiSchema,
      numProcesses: numProcesses.uiSchema,
      lockedMemoryKb: lockedMemoryKb.uiSchema,
      virtualMemoryKb: virtualMemoryKb.uiSchema,
    },
    env: env.uiSchema,
    preconditionScripts: preconditionScripts.uiSchema,
  }),
};

export const allocation = {
  schema: {
    version: version.schema,
    roundingRule: roundingRule.schema,
    feedbackRule: feedbackRule.schema,
    hostsOverallocatedRule: hostsOverallocatedRule.schema,
    minimumHosts: minimumHosts.schema,
    maximumHosts: maximumHosts.schema,
    autoTuneMaximumHosts: autoTuneMaximumHosts.schema,
    acceptableHostIdleTime: acceptableHostIdleTime.schema,
    futureHostFraction: futureHostFraction.schema,
  },
  uiSchema: (hasEC2Provider: boolean, hasStaticProvider: boolean) => ({
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    version: version.uiSchema,
    roundingRule: roundingRule.uiSchema(hasStaticProvider),
    feedbackRule: feedbackRule.uiSchema(hasStaticProvider),
    hostsOverallocatedRule: hostsOverallocatedRule.uiSchema,
    minimumHosts: minimumHosts.uiSchema(hasEC2Provider),
    maximumHosts: maximumHosts.uiSchema(hasEC2Provider),
    autoTuneMaximumHosts: autoTuneMaximumHosts.uiSchema(hasEC2Provider),
    acceptableHostIdleTime: acceptableHostIdleTime.uiSchema(hasEC2Provider),
    futureHostFraction: futureHostFraction.uiSchema(hasEC2Provider),
  }),
};

export const sshConfig = {
  schema: {
    user: user.schema,
    execUser: execUser.schema,
    authorizedKeysFile: authorizedKeysFile.schema,
    sshOptions: sshOptions.schema,
  },
  uiSchema: (hasStaticProvider: boolean) => ({
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    user: user.uiSchema,
    execUser: execUser.uiSchema,
    authorizedKeysFile: authorizedKeysFile.uiSchema(hasStaticProvider),
    sshOptions: sshOptions.uiSchema,
  }),
};
