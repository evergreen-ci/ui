import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import widgets from "components/SpruceForm/Widgets";
import { PriorityLevel } from "gql/generated/types";
import {
  gridWrapCss,
  fullWidthCss,
  nestedObjectGridCss,
} from "../../sharedStyles";

const { gray } = palette;

const retry = {
  schema: {
    type: "object" as const,
    title: "Retry Configuration",
    properties: {
      numWorkers: {
        type: "number" as const,
        title: "Retry Handler Workers",
      },
      maxCapacity: {
        type: "number" as const,
        title: "Retry Handler Max Job Capacity",
      },

      maxRetryAttempts: {
        type: "number" as const,
        title: "Max Retry Handler Attempts per Job",
      },

      maxRetryTimeSeconds: {
        type: "number" as const,
        title: "Max Retry Handler Total Time per Job (secs)",
      },

      retryBackoffSeconds: {
        type: "number" as const,
        title: "Retry Backoff per Job Attempt (secs)",
      },
      staleRetryingMonitorIntervalSeconds: {
        type: "number" as const,
        title: "Frequency to Check Stale Retrying Jobs (secs)",
      },
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
  },
};

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
const namedQueues = {
  schema: {
    type: "array" as const,
    title: "Named queues",
    items: {
      type: "object" as const,
      properties: {
        name: {
          type: "string" as const,
          title: "Name",
        },
        regexp: {
          type: "string" as const,
          title: "Regular Expression",
          format: "validRegex",
        },
        numWorkers: {
          type: "number" as const,
          title: "Number of Workers",
        },
        sampleSize: {
          type: "number" as const,
          title: "Sample Size",
        },
        lockTimeoutSeconds: {
          type: "number" as const,
          title: "Lock Timeout (secs)",
        },
      },
    },
  },
  uiSchema: {
    "ui:addButtonText": "Add queue",
    "ui:data-cy": "named-queue-list",
    "ui:orderable": false,
    "ui:fullWidth": true,
    "ui:fieldCss": fullWidthCss,
    "ui:arrayItemCSS": arrayItemCSS,
    items: {
      regexp: {
        "ui:optional": true,
      },
    },
  },
};

export const amboy = {
  schema: {
    dbURL: {
      type: "string" as const,
      title: "Database URL",
    },
    dbName: {
      type: "string" as const,
      title: "Database Name",
    },
    name: {
      type: "string" as const,
      title: "Name",
    },
    singleName: {
      type: "string" as const,
      title: "Single Worker Name",
    },
    poolSizeLocal: {
      type: "number" as const,
      title: "Local Pool Size",
    },
    poolSizeRemote: {
      type: "number" as const,
      title: "Remote Pool Size",
    },
    localStorage: {
      type: "number" as const,
      title: "Local Storage Size",
    },
    lockTimeoutMinutes: {
      type: "number" as const,
      title: "Lock timeout (mins)",
    },
    sampleSize: {
      type: "number" as const,
      title: "Sample Size",
    },
    groupDefaultWorkers: {
      type: "number" as const,
      title: "Group Default Workers",
    },
    groupPruneFrequencyMinutes: {
      type: "number" as const,
      title: "Group Prune Frequency (mins)",
    },
    groupBackgroundCreateFrequencyMinutes: {
      type: "number" as const,
      title: "Group Background Create Frequency (mins)",
    },
    groupTTLMinutes: {
      type: "number" as const,
      title: "Group TTL (mins)",
    },
    retry: retry.schema,
    namedQueues: namedQueues.schema,
  },
  uiSchema: {
    retry: retry.uiSchema,
    namedQueues: namedQueues.uiSchema,
  },
};

const buffer = {
  schema: {
    type: "object" as const,
    title: "Buffer",
    properties: {
      useAsync: {
        type: "boolean" as const,
        title: "Use asynchronous buffered logger",
      },
      durationSeconds: {
        type: "number" as const,
        title: "Log buffer duration",
      },
      count: {
        type: "number" as const,
        title: "Buffer count",
      },
      incomingBufferFactor: {
        type: "number" as const,
        title: "Incoming Buffer Factor",
      },
    },
  },
  uiSchema: {
    "ui:fieldCss": nestedObjectGridCss,
    useAsync: {
      "ui:fieldCss": fullWidthCss,
    },
  },
};

const priorityOptions = Object.keys(PriorityLevel).map((p) => ({
  type: "string" as const,
  title: p,
  enum: [p.toUpperCase()],
}));

export const loggerConfig = {
  schema: {
    defaultLevel: {
      type: "string" as const,
      title: "Default Level",
      oneOf: priorityOptions,
    },
    thresholdLevel: {
      type: "string" as const,
      title: "Threshold Level",
      oneOf: priorityOptions,
    },
    logkeeperURL: {
      type: "string" as const,
      title: "Logkeeper URL",
      format: "validURL",
    },
    redactKeys: {
      type: "array" as const,
      title: "Redact Keys",
      items: {
        type: "string" as const,
      },
    },
    buffer: buffer.schema,
  },
  uiSchema: {
    defaultLevel: {
      "ui:allowDeselect": false,
    },
    thresholdLevel: {
      "ui:allowDeselect": false,
    },
    redactKeys: {
      "ui:widget": widgets.ChipInputWidget,
      "ui:fieldCss": fullWidthCss,
    },
    buffer: buffer.uiSchema,
  },
};

export const notificationRateLimits = {
  schema: {
    bufferIntervalSeconds: {
      type: "number" as const,
      title: "Time Interval (secs)",
    },
    bufferTargetPerInterval: {
      type: "number" as const,
      title: "Target per Time Interval (secs)",
    },
  },
  uiSchema: {},
};

export const triggers = (distros: string[]) => ({
  schema: {
    generateTaskDistro: {
      type: "string" as const,
      title: "Distro for Generated Tasks",
      oneOf: [
        ...distros.map((d) => ({
          type: "string" as const,
          title: d,
          enum: [d],
        })),
      ],
    },
  },
  uiSchema: {
    generateTaskDistro: {
      "ui:allowDeselect": false,
    },
  },
});
