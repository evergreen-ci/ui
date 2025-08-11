import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import {
  gridWrapCss,
  objectGridCss,
  fullWidthCss,
  nestedObjectGridCss,
} from "../../sharedStyles";

const { gray } = palette;

const arrayItemCSS = css`
  border: 1px solid ${gray.light2};
  border-radius: ${size.m};
  padding: ${size.m};
  margin-bottom: ${size.s};

  > div > fieldset {
    ${gridWrapCss};
  }
`;

export const miscSettings = {
  schema: {
    configDir: {
      type: "string" as const,
      title: "Config Directory",
    },
    domainName: {
      type: "string" as const,
      title: "Domain Name",
    },
    githubPRCreatorOrg: {
      type: "string" as const,
      title: "GitHub PR Creator Organization",
    },
    shutdownWaitSeconds: {
      type: "number" as const,
      title: "Shutdown Wait Time (secs)",
    },
    githubWebhookSecret: {
      type: "string" as const,
      title: "GitHub Webhook Secret",
    },
    pprofPort: {
      type: "string" as const,
      title: "PProf Port",
    },
    logPath: {
      type: "string" as const,
      title: "Log Path",
    },

    perfMonitoringKanopyURL: {
      type: "string" as const,
      title: "Performance Monitoring Kanopy URL",
      format: "validURL",
    },
    perfMonitoringURL: {
      type: "string" as const,
      title: "Performance Monitoring URL",
      format: "validURL",
    },
    githubOrgs: {
      type: "array" as const,
      title: "GitHub Organizations",
      items: {
        type: "string" as const,
      },
    },
    releaseMode: {
      type: "object" as const,
      title: "Release Mode",
      properties: {
        distroMaxHostsFactor: {
          type: "number" as const,
          title: "Distro Max Hosts Factor",
        },
        targetTimeSecondsOverride: {
          type: "number" as const,
          title: "Target Time Override (secs)",
        },
        idleTimeSecondsOverride: {
          type: "number" as const,
          title: "Idle Time Override (secs)",
        },
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "misc-settings",
    "ui:objectFieldCss": objectGridCss,
    githubOrgs: {
      "ui:widget": widgets.ChipInputWidget,
      "ui:fieldCss": fullWidthCss,
    },
    releaseMode: {
      "ui:fieldCss": nestedObjectGridCss,
    },
  },
};

export const singleTaskHost = {
  schema: {
    projectTasksPairs: {
      type: "array" as const,
      title: "Project Tasks Pairs",
      items: {
        type: "object" as const,
        properties: {
          projectId: {
            type: "string" as const,
            title: "Project ID",
          },
          allowedTasks: {
            type: "array" as const,
            title: "Allowed Tasks",
            items: {
              type: "string" as const,
            },
          },
          allowedBVs: {
            type: "array" as const,
            title: "Allowed Build Variants",
            items: {
              type: "string" as const,
            },
          },
        },
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "single-task-host",
    "ui:objectFieldCss": objectGridCss,
    projectTasksPairs: {
      "ui:addButtonText": "Add project tasks pair",
      "ui:data-cy": "project-tasks-pairs-list",
      "ui:orderable": false,
      "ui:fullWidth": true,
      "ui:fieldCss": fullWidthCss,
      "ui:arrayItemCSS": arrayItemCSS,
      items: {
        allowedTasks: {
          "ui:widget": widgets.ChipInputWidget,
        },
        allowedBVs: {
          "ui:widget": widgets.ChipInputWidget,
        },
      },
    },
  },
};

export const bucketConfig = {
  schema: {
    logBucket: {
      type: "object" as const,
      title: "Log Bucket",
      properties: {
        name: {
          type: "string" as const,
          title: "Name",
        },
        testResultsPrefix: {
          type: "string" as const,
          title: "Test Results Prefix",
        },
        roleARN: {
          type: "string" as const,
          title: "Role ARN",
        },
      },
    },
    testResultsBucket: {
      type: "object" as const,
      title: "Test Results Bucket",
      properties: {
        name: {
          type: "string" as const,
          title: "Name",
        },
        testResultsPrefix: {
          type: "string" as const,
          title: "Test Results Prefix",
        },
        roleARN: {
          type: "string" as const,
          title: "Role ARN",
        },
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "bucket-config",
    "ui:objectFieldCss": objectGridCss,
    logBucket: {
      "ui:fieldCss": nestedObjectGridCss,
    },
    testResultsBucket: {
      "ui:fieldCss": nestedObjectGridCss,
    },
  },
};

export const sshPairs = {
  schema: {
    taskHostKey: {
      type: "object" as const,
      title: "Task Host Key",
      properties: {
        name: {
          type: "string" as const,
          title: "Name",
        },
        secretARN: {
          type: "string" as const,
          title: "Secret ARN",
        },
      },
    },
    spawnHostKey: {
      type: "object" as const,
      title: "Spawn Host Key",
      properties: {
        name: {
          type: "string" as const,
          title: "Name",
        },
        secretARN: {
          type: "string" as const,
          title: "Secret ARN",
        },
      },
    },
    kanopySSHKeyPath: {
      type: "string" as const,
      title: "Legacy SSH Key",
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "ssh-pairs",
    "ui:objectFieldCss": objectGridCss,
    taskHostKey: {
      "ui:fieldCss": nestedObjectGridCss,
    },
    spawnHostKey: {
      "ui:fieldCss": nestedObjectGridCss,
    },
    kanopySSHKeyPath: {
      "ui:fieldCss": fullWidthCss,
    },
  },
};

export const expansions = {
  schema: {
    expansionValues: {
      type: "array" as const,
      title: "Expansions",
      items: {
        type: "object" as const,
        properties: {
          key: {
            type: "string" as const,
            title: "Key",
          },
          value: {
            type: "string" as const,
            title: "Value",
          },
        },
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:addButtonText": "Add expansion",
    "ui:data-cy": "expansions-list",
    "ui:orderable": false,
    "ui:fullWidth": true,
    expansionValues: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:arrayItemCSS": arrayItemCSS,
    },
  },
};

export const hostJasper = {
  schema: {
    binaryName: {
      type: "string" as const,
      title: "Binary Name",
    },
    downloadFileName: {
      type: "string" as const,
      title: "Download File Name",
    },
    port: {
      type: "number" as const,
      title: "Port",
    },
    url: {
      type: "string" as const,
      title: "URL",
      format: "validURL",
    },
    version: {
      type: "string" as const,
      title: "Version",
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "host-jasper",
    "ui:objectFieldCss": objectGridCss,
  },
};

export const jiraNotificationsFields = {
  schema: {
    customFields: {
      type: "array" as const,
      title: "Custom Fields",
      items: {
        type: "object" as const,
        properties: {
          project: {
            type: "string" as const,
            title: "Project",
          },
          fields: {
            type: "string" as const,
            title: "Fields (JSON format)",
          },
          components: {
            type: "array" as const,
            title: "Components",
            items: {
              type: "string" as const,
            },
          },
          labels: {
            type: "array" as const,
            title: "Labels",
            items: {
              type: "string" as const,
            },
          },
        },
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "jira-notifications",
    "ui:objectFieldCss": objectGridCss,
    customFields: {
      "ui:addButtonText": "Add custom field",
      "ui:data-cy": "jira-custom-fields-list",
      "ui:orderable": false,
      "ui:fullWidth": true,
      "ui:fieldCss": fullWidthCss,
      "ui:arrayItemCSS": arrayItemCSS,
      items: {
        fields: {
          "ui:widget": widgets.TextareaWidget,
          "ui:placeholder": 'Enter JSON object, e.g. {"field1": "value1"}',
        },
        components: {
          "ui:widget": widgets.ChipInputWidget,
        },
        labels: {
          "ui:widget": widgets.ChipInputWidget,
        },
      },
    },
  },
};

export const spawnHost = {
  schema: {
    unexpirableHostsPerUser: {
      type: "number" as const,
      title: "Unexpirable Hosts Per User",
    },
    unexpirableVolumesPerUser: {
      type: "number" as const,
      title: "Unexpirable Volumes Per User",
    },
    spawnHostsPerUser: {
      type: "number" as const,
      title: "Spawn Hosts Per User",
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "spawn-host",
    "ui:objectFieldCss": objectGridCss,
  },
};

export const sleepSchedule = {
  schema: {
    permanentlyExemptHosts: {
      type: "array" as const,
      title: "Permanently Exempt Hosts",
      items: {
        type: "string" as const,
      },
    },
  },
  uiSchema: {
    "ui:data-cy": "sleep-schedule",
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:objectFieldCss": objectGridCss,
    permanentlyExemptHosts: {
      "ui:widget": widgets.ChipInputWidget,
      "ui:fieldCss": fullWidthCss,
    },
  },
};

export const tracerConfiguration = {
  schema: {
    collectorEndpoint: {
      type: "string" as const,
      title: "Collector Endpoint",
      format: "validURL",
    },
    collectorInternalEndpoint: {
      type: "string" as const,
      title: "Collector Internal Endpoint",
      format: "validURL",
    },
    collectorAPIKey: {
      type: "string" as const,
      title: "Collector API Key",
    },
    enabled: {
      type: "boolean" as const,
      title: "Enabled",
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "tracer-configuration",
    "ui:objectFieldCss": objectGridCss,
  },
};

export const projectCrationSettings = {
  schema: {
    totalProjectLimit: {
      type: "number" as const,
      title: "Total Project Limit",
    },
    repoProjectLimit: {
      type: "number" as const,
      title: "Repository Project Limit",
    },
    jiraProject: {
      type: "string" as const,
      title: "JIRA Project",
    },
    repoExceptions: {
      type: "array" as const,
      title: "Repository Exceptions",
      items: {
        type: "object" as const,
        properties: {
          owner: {
            type: "string" as const,
            title: "Owner",
          },
          repo: {
            type: "string" as const,
            title: "Repository",
          },
        },
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "project-creation-settings",
    "ui:objectFieldCss": objectGridCss,
    repoExceptions: {
      "ui:addButtonText": "Add repository exception",
      "ui:data-cy": "repo-exceptions-list",
      "ui:orderable": false,
      "ui:fullWidth": true,
      "ui:fieldCss": fullWidthCss,
      "ui:arrayItemCSS": arrayItemCSS,
    },
  },
};

export const githubCheckRunConfigurations = {
  schema: {
    checkRunLimit: {
      type: "number" as const,
      title: "Check Run Limit",
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "github-check-run-configurations",
    "ui:objectFieldCss": objectGridCss,
  },
};
