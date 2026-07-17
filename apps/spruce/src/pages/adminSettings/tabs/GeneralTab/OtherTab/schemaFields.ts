import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import {
  arrayItemCSS,
  fullWidthCss,
  nestedObjectGridCss,
  objectGridCss,
} from "../../sharedStyles";

export const oktaServiceConfig = {
  schema: {
    audience: {
      title: "Audience",
      type: "string" as const,
    },
    clientId: {
      title: "Client ID",
      type: "string" as const,
    },
    clientSecret: {
      title: "Client Secret",
      type: "string" as const,
    },
    issuer: {
      title: "Issuer",
      type: "string" as const,
    },
    scopes: {
      items: {
        type: "string" as const,
      },
      title: "Scopes",
      type: "array" as const,
    },
  },
  uiSchema: {
    "ui:data-cy": "okta-service-config",
    "ui:description":
      "Settings for the Okta Services app. Used exclusively for machine-to-machine authentication, e.g. the token exchange grant used in the spawn host workflow.",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const miscSettings = {
  schema: {
    configDir: {
      title: "Config Directory",
      type: "string" as const,
    },
    cost: {
      properties: {
        ebsDiscount: {
          maximum: 1,
          minimum: 0,
          title: "EBS Cost Discount",
          type: "number" as const,
        },
        financeFormula: {
          maximum: 1,
          minimum: 0,
          title: "Finance Formula",
          type: "number" as const,
        },
        hiddenCostProjects: {
          items: {
            type: "string" as const,
          },
          title: "Projects With Hidden Costs",
          type: "array" as const,
        },
        onDemandDiscount: {
          maximum: 1,
          minimum: 0,
          title: "On-Demand Discount",
          type: "number" as const,
        },
        s3Cost: {
          properties: {
            archiveStorageCostDiscount: {
              maximum: 1,
              minimum: 0,
              title: "Archive Storage Cost Discount",
              type: "number" as const,
            },
            artifactAwsAccountsWithoutLifecycleRules: {
              items: {
                type: "string" as const,
              },
              title: "Artifact AWS Account IDs Without Lifecycle Rules",
              type: "array" as const,
            },
            defaultMaxArtifactExpirationDays: {
              minimum: 1,
              title: "Default Max Artifact Expiration Days",
              type: "number" as const,
            },
            devprodOwnedAwsAccountIds: {
              items: {
                type: "string" as const,
              },
              title: "Devprod Owned AWS Account IDs",
              type: "array" as const,
            },
            iAStorageCostDiscount: {
              maximum: 1,
              minimum: 0,
              title: "Infrequent Access Storage Cost Discount",
              type: "number" as const,
            },
            standardStorageCostDiscount: {
              maximum: 1,
              minimum: 0,
              title: "Standard Storage Cost Discount",
              type: "number" as const,
            },
            uploadCostDiscount: {
              maximum: 1,
              minimum: 0,
              title: "Upload Cost Discount",
              type: "number" as const,
            },
          },
          title: "S3 Cost",
          type: "object" as const,
        },
        savingsPlanDiscount: {
          maximum: 1,
          minimum: 0,
          title: "Savings Plan Discount",
          type: "number" as const,
        },
      },
      title: "Cost",
      type: "object" as const,
    },
    domainName: {
      title: "Domain Name",
      type: "string" as const,
    },
    githubOrgs: {
      items: {
        type: "string" as const,
      },
      title: "GitHub Organizations",
      type: "array" as const,
    },
    githubPRCreatorOrg: {
      title: "GitHub PR Creator Organization",
      type: "string" as const,
    },
    githubWebhookSecret: {
      title: "GitHub Webhook Secret",
      type: "string" as const,
    },
    logPath: {
      title: "Log Path",
      type: "string" as const,
    },
    oldestAllowedCLIVersion: {
      title: "Oldest Allowed CLI Version",
      type: "string" as const,
    },
    pprofPort: {
      title: "PProf Port",
      type: "string" as const,
    },
    releaseMode: {
      properties: {
        distroMaxHostsFactor: {
          default: 1,
          title: "Distro Max Hosts Factor",
          type: "number" as const,
        },
        idleTimeSecondsOverride: {
          title: "Idle Time Override (secs)",
          type: "number" as const,
        },
        targetTimeSecondsOverride: {
          title: "Target Time Override (secs)",
          type: "number" as const,
        },
      },
      title: "Release Mode",
      type: "object" as const,
    },
    shutdownWaitSeconds: {
      title: "Shutdown Wait Time (secs)",
      type: "number" as const,
    },
  },
  uiSchema: {
    cost: {
      ebsDiscount: {
        "ui:description":
          "The discount applied to EBS costs (throughput, storage, etc.) (value 0-1).",
      },
      financeFormula: {
        "ui:description":
          "The formula used to calculate the cost of running a task (value 0-1).",
      },
      hiddenCostProjects: {
        "ui:description":
          "Project IDs whose costs are hidden in the UI and API.",
        "ui:fieldCss": fullWidthCss,
        "ui:widget": widgets.ChipInputWidget,
      },
      onDemandDiscount: {
        "ui:description":
          "The discount applied to on-demand tasks (value 0-1).",
      },
      s3Cost: {
        archiveStorageCostDiscount: {
          "ui:description":
            "The discount applied to S3 archive storage costs (value 0-1).",
        },
        artifactAwsAccountsWithoutLifecycleRules: {
          "ui:description":
            "AWS account IDs where we do not have access to fetch lifecycle rules.",
          "ui:fieldCss": fullWidthCss,
          "ui:widget": widgets.ChipInputWidget,
        },
        defaultMaxArtifactExpirationDays: {
          "ui:description":
            "The default maximum number of days before artifacts expire (minimum 1).",
        },
        devprodOwnedAwsAccountIds: {
          "ui:description":
            "AWS account IDs (12 digits) for S3 buckets owned by Devprod, used for cost calculations.",
          "ui:fieldCss": fullWidthCss,
          "ui:widget": widgets.ChipInputWidget,
        },
        iAStorageCostDiscount: {
          "ui:description":
            "The discount applied to S3 infrequent access storage costs (value 0-1).",
        },
        standardStorageCostDiscount: {
          "ui:description":
            "The discount applied to S3 standard storage costs (value 0-1).",
        },
        "ui:fieldCss": nestedObjectGridCss,
        uploadCostDiscount: {
          "ui:description":
            "The discount applied to S3 upload costs (value 0-1).",
        },
      },
      savingsPlanDiscount: {
        "ui:description":
          "The discount applied to tasks that are part of a savings plan (value 0-1).",
      },
      "ui:fieldCss": nestedObjectGridCss,
    },
    githubOrgs: {
      "ui:description": "Organization names are case-sensitive.",
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.ChipInputWidget,
    },
    releaseMode: {
      distroMaxHostsFactor: {
        "ui:description":
          "Multiply distro max hosts by this factor (default is 1 if unset).",
      },
      idleTimeSecondsOverride: {
        "ui:description":
          "Override for the acceptable host idle time (ignored if 0).",
      },
      targetTimeSecondsOverride: {
        "ui:description":
          "Override the target time to clear a task from the queue (ignored if 0)",
      },
      "ui:description":
        "Release mode allows Evergreen to scale more aggressively by affecting the following factors. Note that it doesn't change task queue ordering; this is still handled by adjusting priorities.",
      "ui:fieldCss": nestedObjectGridCss,
    },
    "ui:data-cy": "misc-settings",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
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
      enum: [p.id],
      title: p.displayName,
      type: "string" as const,
    })),
    ...repoRefs.map((r) => ({
      enum: [r.id],
      title: r.displayName,
      type: "string" as const,
    })),
  ];

  return {
    schema: {
      projectTasksPairs: {
        items: {
          properties: {
            allowedBVs: {
              items: {
                type: "string" as const,
              },
              title: "Allowed Build Variants",
              type: "array" as const,
            },
            allowedTasks: {
              items: {
                type: "string" as const,
              },
              title: "Allowed Tasks",
              type: "array" as const,
            },
            projectId: {
              default: "",
              oneOf: projectRepoOptions,
              title: "Project ID / Repo ID",
              type: "string" as const,
            },
          },
          type: "object" as const,
        },
        title: "Project Tasks Pairs",
        type: "array" as const,
      },
    },
    uiSchema: {
      projectTasksPairs: {
        items: {
          allowedBVs: {
            "ui:widget": widgets.ChipInputWidget,
          },
          allowedTasks: {
            "ui:widget": widgets.ChipInputWidget,
          },
          projectId: {
            "ui:widget": widgets.ComboboxWidget,
          },
        },
        "ui:addButtonText": "Add project tasks pair",
        "ui:arrayItemCSS": arrayItemCSS,
        "ui:data-cy": "project-tasks-pairs-list",
        "ui:fieldCss": fullWidthCss,
        "ui:fullWidth": true,
        "ui:orderable": false,
      },
      "ui:data-cy": "single-task-host",
      "ui:objectFieldCss": objectGridCss,
      "ui:ObjectFieldTemplate": CardFieldTemplate,
    },
  };
};

export const bucketConfig = {
  schema: {
    credentialsKey: {
      title: "S3 Key",
      type: "string" as const,
    },
    credentialsSecret: {
      title: "S3 Secret",
      type: "string" as const,
    },
    defaultLogBucket: {
      title: "Default Log Bucket",
      type: "string" as const,
    },
    failedTasksLogBucketExpirationDays: {
      readOnly: true,
      title: "Failed Tasks Log Bucket Expiration Days",
      type: "number" as const,
    },
    failedTasksLogBucketLifecycleLastSyncedAt: {
      readOnly: true,
      title: "Failed Tasks Log Bucket Lifecycle Last Synced At",
      type: "string" as const,
    },
    failedTasksLogBucketLifecycleSyncError: {
      readOnly: true,
      title: "Failed Tasks Log Bucket Lifecycle Sync Error",
      type: "string" as const,
    },
    failedTasksLogBucketName: {
      title: "Failed Tasks Log Bucket",
      type: "string" as const,
    },
    failedTasksLogBucketTransitionToGlacierDays: {
      readOnly: true,
      title: "Failed Tasks Log Bucket Transition to Glacier Days",
      type: "number" as const,
    },
    failedTasksLogBucketTransitionToIADays: {
      readOnly: true,
      title: "Failed Tasks Log Bucket Transition to IA Days",
      type: "number" as const,
    },
    logBucketExpirationDays: {
      readOnly: true,
      title: "Log Bucket Expiration Days",
      type: "number" as const,
    },
    logBucketLifecycleLastSyncedAt: {
      readOnly: true,
      title: "Log Bucket Lifecycle Last Synced At",
      type: "string" as const,
    },
    logBucketLifecycleSyncError: {
      readOnly: true,
      title: "Log Bucket Lifecycle Sync Error",
      type: "string" as const,
    },
    logBucketLongRetentionExpirationDays: {
      readOnly: true,
      title: "Long Retention Log Bucket Expiration Days",
      type: "number" as const,
    },
    logBucketLongRetentionLifecycleLastSyncedAt: {
      readOnly: true,
      title: "Long Retention Log Bucket Lifecycle Last Synced At",
      type: "string" as const,
    },
    logBucketLongRetentionLifecycleSyncError: {
      readOnly: true,
      title: "Long Retention Log Bucket Lifecycle Sync Error",
      type: "string" as const,
    },
    logBucketLongRetentionName: {
      title: "Long Retention Log Bucket",
      type: "string" as const,
    },
    logBucketLongRetentionTransitionToGlacierDays: {
      readOnly: true,
      title: "Long Retention Log Bucket Transition to Glacier Days",
      type: "number" as const,
    },
    logBucketLongRetentionTransitionToIADays: {
      readOnly: true,
      title: "Long Retention Log Bucket Transition to IA Days",
      type: "number" as const,
    },
    logBucketTransitionToGlacierDays: {
      readOnly: true,
      title: "Log Bucket Transition to Glacier Days",
      type: "number" as const,
    },
    logBucketTransitionToIADays: {
      readOnly: true,
      title: "Log Bucket Transition to IA Days",
      type: "number" as const,
    },
    longRetentionProjects: {
      items: {
        type: "string" as const,
      },
      title: "Projects Requiring Long Retention",
      type: "array" as const,
    },
    retryFailedLogMoveLookbackDays: {
      title: "Retry Failed Log Move Lookback Days",
      type: "number" as const,
    },
    retryFailedLogMoveMaxJobsPerRun: {
      title: "Retry Failed Log Move Max Jobs Per Run",
      type: "number" as const,
    },
    testResultsBucketName: {
      title: "Test Results Bucket Name",
      type: "string" as const,
    },
    testResultsBucketRoleARN: {
      title: "Test Results Bucket Role ARN",
      type: "string" as const,
    },
    testResultsBucketTestResultsPrefix: {
      title: "Test Results Bucket Prefix",
      type: "string" as const,
    },
    testResultsBucketType: {
      title: "Test Results Bucket Type",
      type: "string" as const,
    },
  },
  uiSchema: {
    failedTasksLogBucketExpirationDays: { "ui:readonly": true },
    failedTasksLogBucketLifecycleLastSyncedAt: { "ui:readonly": true },
    failedTasksLogBucketLifecycleSyncError: { "ui:readonly": true },
    failedTasksLogBucketTransitionToGlacierDays: { "ui:readonly": true },
    failedTasksLogBucketTransitionToIADays: { "ui:readonly": true },
    logBucketExpirationDays: { "ui:readonly": true },
    logBucketLifecycleLastSyncedAt: { "ui:readonly": true },
    logBucketLifecycleSyncError: { "ui:readonly": true },
    logBucketLongRetentionExpirationDays: { "ui:readonly": true },
    logBucketLongRetentionLifecycleLastSyncedAt: { "ui:readonly": true },
    logBucketLongRetentionLifecycleSyncError: { "ui:readonly": true },
    logBucketLongRetentionTransitionToGlacierDays: { "ui:readonly": true },
    logBucketLongRetentionTransitionToIADays: { "ui:readonly": true },
    logBucketTransitionToGlacierDays: { "ui:readonly": true },
    logBucketTransitionToIADays: { "ui:readonly": true },
    longRetentionProjects: {
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.ChipInputWidget,
    },
    "ui:data-cy": "bucket-config",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const sshPairs = {
  schema: {
    spawnHostKey: {
      properties: {
        name: {
          title: "Name",
          type: "string" as const,
        },
        secretARN: {
          title: "Secret ARN",
          type: "string" as const,
        },
      },
      title: "Spawn Host Key",
      type: "object" as const,
    },
    taskHostKey: {
      properties: {
        name: {
          title: "Name",
          type: "string" as const,
        },
        secretARN: {
          title: "Secret ARN",
          type: "string" as const,
        },
      },
      title: "Task Host Key",
      type: "object" as const,
    },
  },
  uiSchema: {
    spawnHostKey: {
      "ui:data-cy": "spawn-host-key",
      "ui:fieldCss": nestedObjectGridCss,
    },
    taskHostKey: {
      "ui:data-cy": "task-host-key",
      "ui:fieldCss": nestedObjectGridCss,
    },
    "ui:data-cy": "ssh-pairs",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const expansions = {
  schema: {
    expansionValues: {
      items: {
        properties: {
          key: {
            title: "Key",
            type: "string" as const,
          },
          value: {
            title: "Value",
            type: "string" as const,
          },
        },
        type: "object" as const,
      },
      title: "",
      type: "array" as const,
    },
  },
  uiSchema: {
    expansionValues: {
      items: {
        "ui:data-cy": "expansion-item",
        value: {
          "ui:widget": "textarea",
        },
      },
      "ui:addButtonText": "Add expansion",
      "ui:arrayItemCSS": arrayItemCSS,
      "ui:fullWidth": true,
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:orderable": false,
    },
    "ui:data-cy": "expansions-list",
    "ui:fullWidth": true,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const hostJasper = {
  schema: {
    binaryName: {
      title: "Binary Name",
      type: "string" as const,
    },
    downloadFileName: {
      title: "Download File Name",
      type: "string" as const,
    },
    port: {
      title: "Port",
      type: "number" as const,
    },
    url: {
      format: "validURL",
      title: "URL",
      type: "string" as const,
    },
    version: {
      title: "Version",
      type: "string" as const,
    },
  },
  uiSchema: {
    "ui:data-cy": "host-jasper",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const jiraNotificationsFields = {
  schema: {
    customFields: {
      items: {
        properties: {
          components: {
            items: {
              type: "string" as const,
            },
            title: "Components",
            type: "array" as const,
          },
          fields: {
            items: {
              properties: {
                key: {
                  title: "Field Key",
                  type: "string" as const,
                },
                value: {
                  title: "Field Value",
                  type: "string" as const,
                },
              },
              type: "object" as const,
            },
            title: "Fields",
            type: "array" as const,
          },
          labels: {
            items: {
              type: "string" as const,
            },
            title: "Labels",
            type: "array" as const,
          },
          project: {
            title: "Project",
            type: "string" as const,
          },
        },
        type: "object" as const,
      },
      title: "Jira Projects",
      type: "array" as const,
    },
  },
  uiSchema: {
    customFields: {
      items: {
        components: {
          "ui:widget": widgets.ChipInputWidget,
        },
        fields: {
          "ui:addButtonText": "Add custom field",
          "ui:arrayItemCSS": arrayItemCSS,
          "ui:data-cy": "jira-fields-list",
          "ui:fieldCss": fullWidthCss,
          "ui:fullWidth": true,
          "ui:orderable": false,
          "ui:placeholder": "No custom fields defined.",
        },
        labels: {
          "ui:widget": widgets.ChipInputWidget,
        },
        "ui:data-cy": "jira-custom-field-item",
      },
      "ui:addButtonText": "Add new Jira project",
      "ui:arrayItemCSS": arrayItemCSS,
      "ui:data-cy": "jira-custom-fields-list",
      "ui:fieldCss": fullWidthCss,
      "ui:fullWidth": true,
      "ui:orderable": false,
    },
    "ui:data-cy": "jira-notifications",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const spawnHost = {
  schema: {
    spawnHostsPerUser: {
      title: "Total Spawn Hosts Per User",
      type: "number" as const,
    },
    unexpirableHostsPerUser: {
      title: "Unexpirable Hosts Per User",
      type: "number" as const,
    },
    unexpirableVolumesPerUser: {
      title: "Unexpirable Volumes Per User",
      type: "number" as const,
    },
  },
  uiSchema: {
    "ui:data-cy": "spawn-host",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const debugSpawnHostsConfig = {
  schema: {
    setupScript: {
      title: "Setup Script",
      type: "string" as const,
    },
  },
  uiSchema: {
    setupScript: {
      "ui:description":
        "Optional script used to help debug spawn host setup/provisioning.",
      "ui:fieldCss": fullWidthCss,
      "ui:widget": "textarea",
    },
    "ui:data-cy": "debug-spawn-hosts-config",
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const sleepSchedule = {
  schema: {
    permanentlyExemptHosts: {
      items: {
        type: "string" as const,
      },
      title: "Permanently Exempt Hosts",
      type: "array" as const,
    },
  },
  uiSchema: {
    permanentlyExemptHosts: {
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.ChipInputWidget,
    },
    "ui:data-cy": "sleep-schedule",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const tracerConfiguration = {
  schema: {
    collectorAPIKey: {
      title: "Collector API Key",
      type: "string" as const,
    },
    collectorEndpoint: {
      title: "Collector Endpoint",
      type: "string" as const,
    },
    collectorInternalEndpoint: {
      title: "Collector Internal Endpoint",
      type: "string" as const,
    },
    enabled: {
      title: "Enable tracer",
      type: "boolean" as const,
    },
    traceUrlTemplate: {
      title: "Trace URL Template",
      type: "string" as const,
    },
  },
  uiSchema: {
    enabled: {
      "ui:fieldCss": fullWidthCss,
    },
    traceUrlTemplate: {
      "ui:description":
        "fmt.Sprintf template with exactly one %s verb for the W3C trace ID (hex). Example: https://apm.example.com/trace/%s",
      "ui:fieldCss": fullWidthCss,
    },
    "ui:data-cy": "tracer-configuration",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const projectCreationSettings = {
  schema: {
    repoExceptions: {
      items: {
        properties: {
          owner: {
            title: "Owner",
            type: "string" as const,
          },
          repo: {
            title: "Repository",
            type: "string" as const,
          },
        },
        type: "object" as const,
      },
      title: "Repository Exceptions",
      type: "array" as const,
    },
    repoProjectLimit: {
      title: "Repository Project Limit",
      type: "number" as const,
    },
    totalProjectLimit: {
      title: "Total Project Limit",
      type: "number" as const,
    },
  },
  uiSchema: {
    repoExceptions: {
      items: {
        "ui:data-cy": "repo-exception-item",
      },
      "ui:addButtonText": "Add repository exception",
      "ui:arrayItemCSS": arrayItemCSS,
      "ui:data-cy": "repo-exceptions-list",
      "ui:fieldCss": fullWidthCss,
      "ui:fullWidth": true,
      "ui:orderable": false,
    },
    "ui:data-cy": "project-creation-settings",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const diagnosticsConfig = {
  schema: {
    s3BucketName: {
      title: "S3 Bucket Name",
      type: "string" as const,
    },
    s3Prefix: {
      title: "S3 Prefix",
      type: "string" as const,
    },
  },
  uiSchema: {
    s3BucketName: {
      "ui:description": "The S3 bucket where diagnostics data is stored.",
    },
    s3Prefix: {
      "ui:description":
        "The prefix used for diagnostics data in the S3 bucket.",
    },
    "ui:data-cy": "diagnostics-config",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};

export const githubCheckRunConfigurations = {
  schema: {
    checkRunLimit: {
      title: "Check Run Limit",
      type: "number" as const,
    },
  },
  uiSchema: {
    "ui:data-cy": "github-check-run-configurations",
    "ui:objectFieldCss": objectGridCss,
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
};
