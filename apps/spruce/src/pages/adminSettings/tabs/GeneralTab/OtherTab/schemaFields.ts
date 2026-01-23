import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import {
  arrayItemCSS,
  objectGridCss,
  fullWidthCss,
  nestedObjectGridCss,
} from "../../sharedStyles";

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
    oldestAllowedCLIVersion: {
      type: "string" as const,
      title: "Oldest Allowed CLI Version",
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
          default: 1,
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
    cost: {
      type: "object" as const,
      title: "Cost",
      properties: {
        financeFormula: {
          type: "number" as const,
          title: "Finance Formula",
          minimum: 0,
          maximum: 1,
        },
        savingsPlanDiscount: {
          type: "number" as const,
          title: "Savings Plan Discount",
          minimum: 0,
          maximum: 1,
        },
        onDemandDiscount: {
          type: "number" as const,
          title: "On-Demand Discount",
          minimum: 0,
          maximum: 1,
        },
        s3Cost: {
          type: "object" as const,
          title: "S3 Cost",
          properties: {
            uploadCostDiscount: {
              type: "number" as const,
              title: "Upload Cost Discount",
              minimum: 0,
              maximum: 1,
            },
            standardStorageCostDiscount: {
              type: "number" as const,
              title: "Standard Storage Cost Discount",
              minimum: 0,
              maximum: 1,
            },
            iAStorageCostDiscount: {
              type: "number" as const,
              title: "Infrequent Access Storage Cost Discount",
              minimum: 0,
              maximum: 1,
            },
          },
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
      "ui:description":
        "Release mode allows Evergreen to scale more aggressively by affecting the following factors. Note that it doesn't change task queue ordering; this is still handled by adjusting priorities.",
      "ui:fieldCss": nestedObjectGridCss,
      distroMaxHostsFactor: {
        "ui:description":
          "Multiply distro max hosts by this factor (default is 1 if unset).",
      },
      targetTimeSecondsOverride: {
        "ui:description":
          "Override the target time to clear a task from the queue (ignored if 0)",
      },
      idleTimeSecondsOverride: {
        "ui:description":
          "Override for the acceptable host idle time (ignored if 0).",
      },
    },
    cost: {
      "ui:fieldCss": nestedObjectGridCss,
      financeFormula: {
        "ui:description":
          "The formula used to calculate the cost of running a task (value 0-1).",
      },
      savingsPlanDiscount: {
        "ui:description":
          "The discount applied to tasks that are part of a savings plan (value 0-1).",
      },
      onDemandDiscount: {
        "ui:description":
          "The discount applied to on-demand tasks (value 0-1).",
      },
      s3Cost: {
        "ui:fieldCss": nestedObjectGridCss,
        uploadCostDiscount: {
          "ui:description":
            "The discount applied to S3 upload costs (value 0-1).",
        },
        standardStorageCostDiscount: {
          "ui:description":
            "The discount applied to S3 standard storage costs (value 0-1).",
        },
        iAStorageCostDiscount: {
          "ui:description":
            "The discount applied to S3 infrequent access storage costs (value 0-1).",
        },
      },
    },
  },
};

export const getSingleTaskDistroSchema = ({
  projectRefs = [],
  repoRefs = [],
}: {
  projectRefs?: Array<{ id: string; displayName: string }>;
  repoRefs?: Array<{ id: string; displayName: string }>;
}) => {
  const projectRepoOptions = [
    ...projectRefs.map((p) => ({
      type: "string" as const,
      title: `${p.displayName} (Project)`,
      enum: [p.id],
    })),
    ...repoRefs.map((r) => ({
      type: "string" as const,
      title: `${r.displayName} (Repository)`,
      enum: [r.id],
    })),
  ];

  return {
    schema: {
      projectTasksPairs: {
        type: "array" as const,
        title: "Project Tasks Pairs",
        items: {
          type: "object" as const,
          properties: {
            projectId: {
              type: "string" as const,
              title: "Project ID / Repo",
              oneOf: projectRepoOptions,
              default: "",
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
          projectId: {
            "ui:allowDeselect": false,
          },
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
};

export const bucketConfig = {
  schema: {
    defaultLogBucket: {
      type: "string" as const,
      title: "Default Log Bucket",
    },
    logBucketLongRetentionName: {
      type: "string" as const,
      title: "Long Retention Log Bucket",
    },
    longRetentionProjects: {
      type: "array" as const,
      title: "Projects Requiring Long Retention",
      items: {
        type: "string" as const,
      },
    },
    testResultsBucketName: {
      type: "string" as const,
      title: "Test Results Bucket Name",
    },
    testResultsBucketTestResultsPrefix: {
      type: "string" as const,
      title: "Test Results Bucket Prefix",
    },
    testResultsBucketRoleARN: {
      type: "string" as const,
      title: "Test Results Bucket Role ARN",
    },
    testResultsBucketType: {
      type: "string" as const,
      title: "Test Results Bucket Type",
    },
    credentialsKey: {
      type: "string" as const,
      title: "S3 Key",
    },
    credentialsSecret: {
      type: "string" as const,
      title: "S3 Secret",
    },
    failedTasksLogBucketName: {
      type: "string" as const,
      title: "Failed Tasks Log Bucket",
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "bucket-config",
    "ui:objectFieldCss": objectGridCss,
    longRetentionProjects: {
      "ui:widget": widgets.ChipInputWidget,
      "ui:fieldCss": fullWidthCss,
    },
  },
};

export const sshPairs = {
  schema: {
    kanopySSHKeyPath: {
      type: "string" as const,
      title: "Legacy SSH Key",
    },
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
      title: "",
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
    "ui:data-cy": "expansions-list",
    "ui:fullWidth": true,
    expansionValues: {
      "ui:orderable": false,
      "ui:fullWidth": true,
      "ui:addButtonText": "Add expansion",
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:arrayItemCSS": arrayItemCSS,
      items: {
        value: {
          "ui:widget": "textarea",
        },
      },
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
      title: "Jira Projects",
      items: {
        type: "object" as const,
        properties: {
          project: {
            type: "string" as const,
            title: "Project",
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
          fields: {
            type: "array" as const,
            title: "Fields",
            items: {
              type: "object" as const,
              properties: {
                key: {
                  type: "string" as const,
                  title: "Field Key",
                },
                value: {
                  type: "string" as const,
                  title: "Field Value",
                },
              },
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
      "ui:addButtonText": "Add new Jira project",
      "ui:data-cy": "jira-custom-fields-list",
      "ui:orderable": false,
      "ui:fullWidth": true,
      "ui:fieldCss": fullWidthCss,
      "ui:arrayItemCSS": arrayItemCSS,
      items: {
        fields: {
          "ui:addButtonText": "Add custom field",
          "ui:placeholder": "No custom fields defined.",
          "ui:data-cy": "jira-fields-list",
          "ui:orderable": false,
          "ui:fullWidth": true,
          "ui:fieldCss": fullWidthCss,
          "ui:arrayItemCSS": arrayItemCSS,
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
    spawnHostsPerUser: {
      type: "number" as const,
      title: "Total Spawn Hosts Per User",
    },
    unexpirableHostsPerUser: {
      type: "number" as const,
      title: "Unexpirable Hosts Per User",
    },
    unexpirableVolumesPerUser: {
      type: "number" as const,
      title: "Unexpirable Volumes Per User",
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
    enabled: {
      type: "boolean" as const,
      title: "Enable tracer",
    },
    collectorEndpoint: {
      type: "string" as const,
      title: "Collector Endpoint",
    },
    collectorInternalEndpoint: {
      type: "string" as const,
      title: "Collector Internal Endpoint",
    },
    collectorAPIKey: {
      type: "string" as const,
      title: "Collector API Key",
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    "ui:data-cy": "tracer-configuration",
    "ui:objectFieldCss": objectGridCss,
    enabled: {
      "ui:fieldCss": fullWidthCss,
    },
  },
};

export const projectCreationSettings = {
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
      title: "Jira Project",
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
