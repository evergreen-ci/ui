import { css } from "@emotion/react";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { InlineCode } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import {
  AccordionFieldTemplate,
  CardFieldTemplate,
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
    enum: [key],
    title,
    type: "string" as const,
  }));

const bootstrapMethod = {
  schema: {
    oneOf: enumSelect(bootstrapMethodToCopy),
    title: "Host Bootstrap Method",
    type: "string" as const,
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const communicationMethod = {
  schema: {
    oneOf: enumSelect(communicationMethodToCopy),
    title: "Host Communication Method",
    type: "string" as const,
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const arch = {
  schema: {
    oneOf: enumSelect(architectureToCopy),
    title: "Agent Architecture",
    type: "string" as const,
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const workDir = {
  schema: {
    minLength: 1,
    title: "Working Directory",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description":
      "Absolute path in which the agent run tasks on the host machine",
  },
};

const setupAsSudo = {
  schema: {
    title: "Run script as sudo",
    type: "boolean" as const,
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
    title: "Setup Script",
    type: "string" as const,
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
    title: "Spawnable",
    type: "boolean" as const,
  },
  uiSchema: (hasStaticProvider: boolean, isSingleTaskDistro: boolean) => ({
    ...(hasStaticProvider && {
      "ui:disabled": true,
      "ui:tooltipDescription": "Static distros are not spawnable.",
    }),
    ...(isSingleTaskDistro && {
      "ui:disabled": true,
      "ui:tooltipDescription": "Single task distros are not spawnable.",
    }),
    "ui:bold": true,
    "ui:description": "Allow users to spawn these hosts for personal use.",
  }),
};

export const isVirtualWorkStation = {
  schema: {
    title: "Virtual Workstations",
    type: "boolean" as const,
  },
  uiSchema: (architecture: Arch) => ({
    ...(!linuxArchitectures.includes(architecture) && {
      "ui:disabled": true,
      "ui:tooltipDescription":
        "Only Linux distros may be configured as virtual workstations.",
    }),

    "ui:bold": true,
    "ui:description":
      "Allow spawned hosts of this distro to be used as virtual workstations.",
  }),
};

export const icecreamSchedulerHost = {
  schema: {
    title: "Icecream Scheduler Host",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description": "Host name to connect to the icecream scheduler",
    "ui:elementWrapperCSS": indentCSS,
  },
};

export const icecreamConfigPath = {
  schema: {
    title: "Icecream Config File Path",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description": "Path to the icecream config file",
    "ui:elementWrapperCSS": indentCSS,
  },
};

export const rootDir = {
  schema: {
    title: "Root Directory",
    type: "string" as const,
  },
  uiSchema: {},
};

export const mountpoints = {
  schema: {
    items: {
      default: "",
      minLength: 1,
      title: "Mountpoint",
      type: "string" as const,
    },
    title: "Mountpoints",
    type: "array" as const,
  },
  uiSchema: {
    items: {
      "ui:placeholder": "/data",
    },
    "ui:addButtonText": "Add mountpoint",
    "ui:description": "Mointpoints configured on the host.",
    "ui:orderable": false,
  },
};

const serviceUser = {
  schema: {
    title: "Service User",
    type: "string" as const,
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
    minLength: 1,
    title: "Jasper Binary Directory",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description":
      "Absolute native path to the directory containing the Jasper binary",
  },
};

export const jasperCredentialsPath = {
  schema: {
    minLength: 1,
    title: "Jasper Credentials Path",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description":
      "Absolute native path to the directory containing the Jasper credentials",
  },
};

const clientDir = {
  schema: {
    minLength: 1,
    title: "Client Directory",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description":
      "Absolute native path to the directory containing the evergreen binary",
  },
};

const shellPath = {
  schema: {
    minLength: 1,
    title: "Shell Path",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description": "Absolute native path to the shell binary file (bash)",
  },
};

const homeVolumeFormatCommand = {
  schema: {
    title: "Home Volume Format Command",
    type: "string" as const,
  },
  uiSchema: {},
};

const numFiles = {
  schema: {
    minimum: -1,
    title: "Number of Files",
    type: "number" as const,
  },
  uiSchema: {
    "ui:description": "Max number of open file handles. Set -1 for unlimited.",
  },
};

const numTasks = {
  schema: {
    minimum: -1,
    title: "Number of CGroup Tasks",
    type: "number" as const,
  },
  uiSchema: {
    "ui:description":
      "Max number of cgroup tasks (threads). Set -1 for unlimited.",
  },
};

const numProcesses = {
  schema: {
    minimum: -1,
    title: "Number of Processes",
    type: "number" as const,
  },
  uiSchema: {
    "ui:description": "Max number of processes. Set -1 for unlimited.",
  },
};

const lockedMemoryKb = {
  schema: {
    minimum: -1,
    title: "Locked Memory",
    type: "number" as const,
  },
  uiSchema: {
    "ui:description":
      "Max size (kB) that can be locked into memory. Set -1 for unlimited.",
  },
};

const virtualMemoryKb = {
  schema: {
    minimum: -1,
    title: "Virtual Memory",
    type: "number" as const,
  },
  uiSchema: {
    "ui:description":
      "Max size (kB) of available virtual memory. Set -1 for unlimited.",
  },
};

const env = {
  schema: {
    items: {
      properties: {
        key: {
          default: "",
          minLength: 1,
          title: "Key",
          type: "string" as const,
        },
        value: {
          default: "",
          minLength: 1,
          title: "Value",
          type: "string" as const,
        },
      },
      type: "object" as const,
    },
    title: "Environment Variables",
    type: "array" as const,
  },
  uiSchema: {
    items: {
      "ui:ObjectFieldTemplate": FieldRow,
    },
    "ui:addButtonText": "Add variable",
    "ui:fullWidth": true,
    "ui:orderable": false,
  },
};

const preconditionScripts = {
  schema: {
    items: {
      properties: {
        path: {
          default: "",
          minLength: 1,
          title: "Path",
          type: "string" as const,
        },
        script: {
          default: "",
          minLength: 1,
          title: "Script",
          type: "string" as const,
        },
      },
      type: "object" as const,
    },
    title: "Precondition Scripts",
    type: "array" as const,
  },
  uiSchema: {
    items: {
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
      "ui:numberedTitle": "Precondition Script",
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
    },
    "ui:addButtonText": "Add script",
    "ui:fullWidth": true,
    "ui:orderable": false,
    "ui:topAlignDelete": true,
  },
};

const user = {
  schema: {
    minLength: 1,
    title: "SSH User",
    type: "string" as const,
  },
  uiSchema: {
    "ui:description": "Username with which to SSH into the host machine.",
  },
};

const execUser = {
  schema: {
    title: "Exec User",
    type: "string" as const,
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
    title: "Authorized Keys File",
    type: "string" as const,
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
    items: {
      default: "",
      minLength: 1,
      title: "SSH Option",
      type: "string" as const,
    },
    title: "SSH Options",
    type: "array" as const,
  },
  uiSchema: {
    items: {
      "ui:placeholder": "ConnectTimeout=10",
    },
    "ui:addButtonText": "Add SSH option",
    "ui:description": (
      <>
        Specify option keywords supported by <InlineCode>ssh_config</InlineCode>
        .
      </>
    ),
    "ui:orderable": false,
  },
};

const version = {
  schema: {
    oneOf: enumSelect(hostAllocatorVersionToCopy),
    title: "Host Allocator Version",
    type: "string" as const,
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const roundingRule = {
  schema: {
    oneOf: enumSelect(roundingRuleToCopy),
    title: "Host Allocator Rounding Rule",
    type: "string" as const,
  },
  uiSchema: (hasStaticProvider: boolean) => ({
    "ui:allowDeselect": false,
    "ui:data-cy": "rounding-rule-select",
    ...(hasStaticProvider && { "ui:widget": "hidden" }),
  }),
};

const feedbackRule = {
  schema: {
    oneOf: enumSelect(feedbackRuleToCopy),
    title: "Host Allocator Feedback Rule",
    type: "string" as const,
  },
  uiSchema: (hasStaticProvider: boolean) => ({
    "ui:allowDeselect": false,
    "ui:data-cy": "feedback-rule-select",
    ...(hasStaticProvider && { "ui:widget": "hidden" }),
  }),
};

const hostsOverallocatedRule = {
  schema: {
    oneOf: enumSelect(overallocatedRuleToCopy),
    title: "Host Overallocation Rule",
    type: "string" as const,
  },
  uiSchema: {
    "ui:allowDeselect": false,
  },
};

const autoTuneMaximumHosts = {
  schema: {
    default: false,
    title: "Auto Tune Maximum Hosts",
    type: "boolean" as const,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:description":
      "Automatically adjust max hosts according to recent host usage.",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

const minimumHosts = {
  schema: {
    minimum: 0,
    title: "Minimum Number of Hosts Allowed",
    type: "number" as const,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "minimum-hosts-input",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

const maximumHosts = {
  schema: {
    minimum: 0,
    title: "Maximum Number of Hosts Allowed",
    type: "number" as const,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "maximum-hosts-input",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

const acceptableHostIdleTimeSeconds = {
  schema: {
    minimum: 0,
    multipleOf: 1,
    title: "Acceptable Host Idle Time (secs)",
    type: "number" as const,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "idle-time-input",
    "ui:description": "Set 0 to use global default.",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

const futureHostFraction = {
  schema: {
    maximum: 1,
    minimum: 0,
    title: "Future Host Fraction",
    type: "number" as const,
  },
  uiSchema: (hasEC2Provider: boolean) => ({
    "ui:data-cy": "future-fraction-input",
    "ui:description": "Set 0 to use global default.",
    ...(!hasEC2Provider && { "ui:widget": "hidden" }),
  }),
};

export const setup = {
  schema: {
    arch: arch.schema,
    bootstrapMethod: bootstrapMethod.schema,
    communicationMethod: communicationMethod.schema,
    mountpoints: mountpoints.schema,
    setupAsSudo: setupAsSudo.schema,
    setupScript: setupScript.schema,
    userSpawnAllowed: userSpawnAllowed.schema,
    workDir: workDir.schema,
  },
  uiSchema: (
    architecture: Arch,
    hasStaticProvider: boolean,
    isSingleTaskDistro: boolean,
  ) => ({
    arch: arch.uiSchema,
    bootstrapMethod: bootstrapMethod.uiSchema,
    communicationMethod: communicationMethod.uiSchema,
    icecreamConfigPath: icecreamConfigPath.uiSchema,
    icecreamSchedulerHost: icecreamSchedulerHost.uiSchema,
    isVirtualWorkStation: isVirtualWorkStation.uiSchema(architecture),
    mountpoints: mountpoints.uiSchema,
    setupAsSudo: setupAsSudo.uiSchema,
    setupScript: setupScript.uiSchema,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    userSpawnAllowed: userSpawnAllowed.uiSchema(
      hasStaticProvider,
      isSingleTaskDistro,
    ),
    workDir: workDir.uiSchema,
  }),
};

export const bootstrap = {
  schema: {
    clientDir: clientDir.schema,
    env: env.schema,
    homeVolumeFormatCommand: homeVolumeFormatCommand.schema,
    jasperBinaryDir: jasperBinaryDir.schema,
    jasperCredentialsPath: jasperCredentialsPath.schema,
    preconditionScripts: preconditionScripts.schema,
    resourceLimits: {
      properties: {
        lockedMemoryKb: lockedMemoryKb.schema,
        numFiles: numFiles.schema,
        numProcesses: numProcesses.schema,
        numTasks: numTasks.schema,
        virtualMemoryKb: virtualMemoryKb.schema,
      },
      required: [
        "numFiles",
        "numTasks",
        "numProcesses",
        "lockedMemoryKb",
        "virtualMemoryKb",
      ],
      title: "Resource Limits",
      type: "object" as const,
    },
    serviceUser: serviceUser.schema,
    shellPath: shellPath.schema,
  },
  uiSchema: (architecture: Arch) => ({
    clientDir: clientDir.uiSchema,
    env: env.uiSchema,
    jasperBinaryDir: jasperBinaryDir.uiSchema,
    jasperCredentialsPath: jasperCredentialsPath.uiSchema,
    preconditionScripts: preconditionScripts.uiSchema,
    resourceLimits: {
      // Only visible for Linux
      ...(!linuxArchitectures.includes(architecture) && {
        "ui:widget": "hidden",
      }),
      lockedMemoryKb: lockedMemoryKb.uiSchema,
      numFiles: numFiles.uiSchema,
      numProcesses: numProcesses.uiSchema,
      numTasks: numTasks.uiSchema,
      virtualMemoryKb: virtualMemoryKb.uiSchema,
    },
    serviceUser: serviceUser.uiSchema(architecture),
    shellPath: shellPath.uiSchema,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  }),
};

export const allocation = {
  schema: {
    acceptableHostIdleTimeSeconds: acceptableHostIdleTimeSeconds.schema,
    autoTuneMaximumHosts: autoTuneMaximumHosts.schema,
    feedbackRule: feedbackRule.schema,
    futureHostFraction: futureHostFraction.schema,
    hostsOverallocatedRule: hostsOverallocatedRule.schema,
    maximumHosts: maximumHosts.schema,
    minimumHosts: minimumHosts.schema,
    roundingRule: roundingRule.schema,
    version: version.schema,
  },
  uiSchema: (hasEC2Provider: boolean, hasStaticProvider: boolean) => ({
    acceptableHostIdleTimeSeconds:
      acceptableHostIdleTimeSeconds.uiSchema(hasEC2Provider),
    autoTuneMaximumHosts: autoTuneMaximumHosts.uiSchema(hasEC2Provider),
    feedbackRule: feedbackRule.uiSchema(hasStaticProvider),
    futureHostFraction: futureHostFraction.uiSchema(hasEC2Provider),
    hostsOverallocatedRule: hostsOverallocatedRule.uiSchema,
    maximumHosts: maximumHosts.uiSchema(hasEC2Provider),
    minimumHosts: minimumHosts.uiSchema(hasEC2Provider),
    roundingRule: roundingRule.uiSchema(hasStaticProvider),
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    version: version.uiSchema,
  }),
};

export const sshConfig = {
  schema: {
    authorizedKeysFile: authorizedKeysFile.schema,
    execUser: execUser.schema,
    sshOptions: sshOptions.schema,
    user: user.schema,
  },
  uiSchema: (hasStaticProvider: boolean) => ({
    authorizedKeysFile: authorizedKeysFile.uiSchema(hasStaticProvider),
    execUser: execUser.uiSchema,
    sshOptions: sshOptions.uiSchema,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    user: user.uiSchema,
  }),
};
