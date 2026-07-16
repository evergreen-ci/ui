import widgets from "components/SpruceForm/Widgets";
import { PriorityLevel } from "gql/generated/types";
import {
  arrayItemCSS,
  fullWidthCss,
  nestedObjectGridCss,
} from "../../sharedStyles";

const retry = {
  schema: {
    properties: {
      maxCapacity: {
        title: "Retry Handler Max Job Capacity",
        type: "number" as const,
      },
      maxRetryAttempts: {
        title: "Max Retry Handler Attempts per Job",
        type: "number" as const,
      },

      maxRetryTimeSeconds: {
        title: "Max Retry Handler Total Time per Job (secs)",
        type: "number" as const,
      },

      numWorkers: {
        title: "Retry Handler Workers",
        type: "number" as const,
      },

      retryBackoffSeconds: {
        title: "Retry Backoff per Job Attempt (secs)",
        type: "number" as const,
      },
      staleRetryingMonitorIntervalSeconds: {
        title: "Frequency to Check Stale Retrying Jobs (secs)",
        type: "number" as const,
      },
    },
    title: "Retry Configuration",
    type: "object" as const,
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
  },
};

const namedQueues = {
  schema: {
    items: {
      properties: {
        lockTimeoutSeconds: {
          title: "Lock Timeout (secs)",
          type: "number" as const,
        },
        name: {
          title: "Name",
          type: "string" as const,
        },
        numWorkers: {
          title: "Number of Workers",
          type: "number" as const,
        },
        regexp: {
          format: "validRegex",
          title: "Regular Expression",
          type: "string" as const,
        },
        sampleSize: {
          title: "Sample Size",
          type: "number" as const,
        },
      },
      type: "object" as const,
    },
    title: "Named queues",
    type: "array" as const,
  },
  uiSchema: {
    items: {
      regexp: {
        "ui:optional": true,
      },
    },
    "ui:addButtonText": "Add queue",
    "ui:arrayItemCSS": arrayItemCSS,
    "ui:data-cy": "named-queue-list",
    "ui:fieldCss": fullWidthCss,
    "ui:fullWidth": true,
    "ui:orderable": false,
  },
};

export const amboy = {
  schema: {
    dbName: {
      title: "Database Name",
      type: "string" as const,
    },
    dbURL: {
      title: "Database URL",
      type: "string" as const,
    },
    groupBackgroundCreateFrequencyMinutes: {
      title: "Group Background Create Frequency (mins)",
      type: "number" as const,
    },
    groupDefaultWorkers: {
      title: "Group Default Workers",
      type: "number" as const,
    },
    groupPruneFrequencyMinutes: {
      title: "Group Prune Frequency (mins)",
      type: "number" as const,
    },
    groupTTLMinutes: {
      title: "Group TTL (mins)",
      type: "number" as const,
    },
    localStorage: {
      title: "Local Storage Size",
      type: "number" as const,
    },
    lockTimeoutMinutes: {
      title: "Lock timeout (mins)",
      type: "number" as const,
    },
    name: {
      title: "Name",
      type: "string" as const,
    },
    namedQueues: namedQueues.schema,
    poolSizeLocal: {
      title: "Local Pool Size",
      type: "number" as const,
    },
    poolSizeRemote: {
      title: "Remote Pool Size",
      type: "number" as const,
    },
    retry: retry.schema,
    sampleSize: {
      title: "Sample Size",
      type: "number" as const,
    },
    singleName: {
      title: "Single Worker Name",
      type: "string" as const,
    },
  },
  uiSchema: {
    namedQueues: namedQueues.uiSchema,
    retry: retry.uiSchema,
  },
};

const buffer = {
  schema: {
    properties: {
      count: {
        title: "Buffer count",
        type: "number" as const,
      },
      durationSeconds: {
        title: "Log buffer duration",
        type: "number" as const,
      },
      incomingBufferFactor: {
        title: "Incoming Buffer Factor",
        type: "number" as const,
      },
      useAsync: {
        title: "Use asynchronous buffered logger",
        type: "boolean" as const,
      },
    },
    title: "Buffer",
    type: "object" as const,
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
    useAsync: {
      "ui:fieldCss": fullWidthCss,
    },
  },
};

const priorityOptions = Object.keys(PriorityLevel).map((p) => ({
  enum: [p.toUpperCase()],
  title: p,
  type: "string" as const,
}));

export const loggerConfig = {
  schema: {
    buffer: buffer.schema,
    defaultLevel: {
      oneOf: priorityOptions,
      title: "Default Level",
      type: "string" as const,
    },
    logkeeperURL: {
      format: "validURL",
      title: "Logkeeper URL",
      type: "string" as const,
    },
    redactKeys: {
      items: {
        type: "string" as const,
      },
      title: "Redact Keys",
      type: "array" as const,
    },
    thresholdLevel: {
      oneOf: priorityOptions,
      title: "Threshold Level",
      type: "string" as const,
    },
  },
  uiSchema: {
    buffer: buffer.uiSchema,
    defaultLevel: {
      "ui:allowDeselect": false,
    },
    redactKeys: {
      "ui:fieldCss": fullWidthCss,
      "ui:widget": widgets.ChipInputWidget,
    },
    thresholdLevel: {
      "ui:allowDeselect": false,
    },
  },
};

export const notificationRateLimits = {
  schema: {
    bufferIntervalSeconds: {
      title: "Time Interval (secs)",
      type: "number" as const,
    },
    bufferTargetPerInterval: {
      title: "Target per Time Interval (secs)",
      type: "number" as const,
    },
  },
  uiSchema: {},
};

export const triggers = {
  schema: {
    generateTaskDistro: {
      title: "Distro for Generated Tasks",
      type: "string" as const,
    },
  },
  uiSchema: {
    generateTaskDistro: {
      "ui:allowDeselect": false,
    },
  },
};
