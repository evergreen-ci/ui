import {
  FeedbackRule,
  FinderVersion,
  HostAllocatorVersion,
  OverallocatedRule,
  RoundingRule,
} from "gql/generated/types";
import { fullWidthCss } from "../../sharedStyles";

export const notify = {
  schema: {
    sesEmail: {
      format: "validEmail",
      title: "SES Email",
      type: "string" as const,
    },
  },
  uiSchema: {},
};

export const taskLimits = {
  schema: {
    maxConcurrentLargeParserProjectTasks: {
      title: "Max Concurrent Large Parser Project Tasks",
      type: "number" as const,
    },
    maxDailyAutomaticRestarts: {
      title: "Max Daily Automatic Restarts Per Project",
      type: "number" as const,
    },
    maxDegradedModeConcurrentLargeParserProjectTasks: {
      title: "CPU Degraded Concurrent Large Parser Project Tasks",
      type: "number" as const,
    },
    maxDegradedModeParserProjectSize: {
      title: "CPU Degraded Parser Project Limit (MB)",
      type: "number" as const,
    },
    maxExecTimeoutSecs: {
      title: "Max Task Exec Timeout (secs)",
      type: "number" as const,
    },
    maxGenerateTaskJSONSize: {
      title: "Generate Task JSON Limit (MB)",
      type: "number" as const,
    },
    maxHourlyPatchTasks: {
      title: "Max Hourly Patch Tasks Per User",
      type: "number" as const,
    },
    maxIncludesPerVersion: {
      title: "Max Includes Per Version",
      type: "number" as const,
    },
    maxParserProjectSize: {
      title: "Max Parser Project Size (MB)",
      type: "number" as const,
    },
    maxPendingGeneratedTasks: {
      title: "Max Pending Generated Tasks",
      type: "number" as const,
    },
    maxScheduledTasksPerDistro: {
      title: "Max Scheduled Tasks Per Distro",
      type: "number" as const,
    },
    maxTaskExecution: {
      title: "Max Task Execution Number (zero based)",
      type: "number" as const,
    },
    maxTasksPerVersion: {
      title: "Max Tasks Per Version",
      type: "number" as const,
    },
  },
  uiSchema: {
    maxScheduledTasksPerDistro: {
      "ui:description":
        "Maximum number of tasks the scheduler materializes into a single distro's task queue per pass. 0 means no limit.",
    },
  },
};

export const hostInit = {
  schema: {
    cloudStatusBatchSize: {
      title: "Cloud Status Batch Size",
      type: "number" as const,
    },
    hostThrottle: {
      title: "Host Creation Throttle (num hosts)",
      type: "number" as const,
    },
    maxTotalDynamicHosts: {
      title: "Max Total Dynamic Hosts",
      type: "number" as const,
    },
    provisioningThrottle: {
      title: "Host Provisioning Throttle (num hosts)",
      type: "number" as const,
    },
  },
  uiSchema: {},
};

const boundsDescription = "Value should range from 0 to 100 inclusive.";
const finderOptions = [
  {
    enum: [FinderVersion.Legacy],
    title: "Legacy",
    type: "string" as const,
  },
  {
    enum: [FinderVersion.Parallel],
    title: "Parallel",
    type: "string" as const,
  },
  {
    enum: [FinderVersion.Alternate],
    title: "Alternate",
    type: "string" as const,
  },
  {
    enum: [FinderVersion.Pipeline],
    title: "Pipeline",
    type: "string" as const,
  },
];
const hostAllocatorOptions = [
  {
    enum: [HostAllocatorVersion.Utilization],
    title: "Utilization",
    type: "string" as const,
  },
];
const roundingOptions = [
  {
    enum: [RoundingRule.Down],
    title: "Round down",
    type: "string" as const,
  },
  {
    enum: [RoundingRule.Up],
    title: "Round up",
    type: "string" as const,
  },
];

const feedbackOptions = [
  {
    enum: [FeedbackRule.NoFeedback],
    title: "No feedback",
    type: "string" as const,
  },
  {
    enum: [FeedbackRule.WaitsOverThresh],
    title: "Wait over threshold",
    type: "string" as const,
  },
];

const overallocatedOptions = [
  {
    enum: [OverallocatedRule.Ignore],
    title: "No terminations when overallocated",
    type: "string" as const,
  },
  {
    enum: [OverallocatedRule.Terminate],
    title: "Terminate hosts when overallocated",
    type: "string" as const,
  },
];

export const scheduler = {
  schema: {
    acceptableHostIdleTimeSeconds: {
      title: "Acceptable Host Idle Time (secs)",
      type: "number" as const,
    },
    cacheDurationSeconds: {
      title: "Cache Schedules in API (secs)",
      type: "number" as const,
    },
    commitQueueFactor: {
      default: 0,
      maximum: 100,
      minimum: 0,
      title: "Commit Queue Factor",
      type: "number" as const,
    },
    expectedRuntimeFactor: {
      default: 0,
      maximum: 100,
      minimum: 0,
      title: "Expected Runtime Factor",
      type: "number" as const,
    },
    futureHostFraction: {
      maximum: 1,
      minimum: 0,
      title: "Default Future Host Fraction",
      type: "number" as const,
    },
    generateTaskFactor: {
      default: 0,
      maximum: 100,
      minimum: 0,
      title: "Generate Task Factor",
      type: "number" as const,
    },
    groupVersions: {
      title: "Group Versions",
      type: "boolean" as const,
    },
    hostAllocator: {
      oneOf: hostAllocatorOptions,
      title: "Host Allocator",
      type: "string" as const,
    },
    hostAllocatorFeedbackRule: {
      oneOf: feedbackOptions,
      title: "Feedback Rule",
      type: "string" as const,
    },
    hostAllocatorRoundingRule: {
      oneOf: roundingOptions,
      title: "Rounding Rule",
      type: "string" as const,
    },
    hostsOverallocatedRule: {
      oneOf: overallocatedOptions,
      title: "Overallocation Rule",
      type: "string" as const,
    },
    mainlineTimeInQueueFactor: {
      default: 0,
      maximum: 100,
      minimum: 0,
      title: "Mainline Time In Queue Factor",
      type: "number" as const,
    },
    numDependentsFactor: {
      default: 0,
      maximum: 100,
      minimum: 0,
      title: "Num Dependents Factor",
      type: "number" as const,
    },
    patchFactor: {
      default: 0,
      maximum: 100,
      minimum: 0,
      title: "Patch Factor",
      type: "number" as const,
    },
    patchTimeInQueueFactor: {
      default: 0,
      maximum: 100,
      minimum: 0,
      title: "Patch Time In Queue Factor",
      type: "number" as const,
    },
    stepbackTaskFactor: {
      default: 0,
      maximum: 100,
      minimum: 0,
      title: "Stepback Task Factor",
      type: "number" as const,
    },
    targetTimeSeconds: {
      title: "Target Time (secs)",
      type: "number" as const,
    },
    taskFinder: {
      oneOf: finderOptions,
      title: "Task Finder",
      type: "string" as const,
    },
    translateProjectCacheBytesLimit: {
      default: 0,
      minimum: 0,
      title: "Translate Project Cache Bytes Limit",
      type: "number" as const,
    },
    translateProjectCacheTTLSeconds: {
      default: 0,
      minimum: 0,
      title: "Translate Project Cache TTL (secs)",
      type: "number" as const,
    },
    translateProjectConcurrencyLimit: {
      default: 0,
      minimum: 0,
      title: "Translate Project Concurrency Limit",
      type: "number" as const,
    },
  },
  uiSchema: {
    commitQueueFactor: {
      "ui:description": boundsDescription,
    },
    expectedRuntimeFactor: {
      "ui:description": boundsDescription,
    },
    generateTaskFactor: {
      "ui:description": boundsDescription,
    },
    groupVersions: {
      "ui:description":
        "Groups tasks by their version ID in the underlying planning queue.",
      "ui:fieldCss": fullWidthCss,
    },
    hostAllocator: {
      "ui:allowDeselect": false,
      "ui:fieldCss": fullWidthCss,
    },
    hostAllocatorFeedbackRule: {
      "ui:allowDeselect": false,
      "ui:fieldCss": fullWidthCss,
    },
    hostAllocatorRoundingRule: {
      "ui:allowDeselect": false,
      "ui:fieldCss": fullWidthCss,
    },
    hostsOverallocatedRule: {
      "ui:allowDeselect": false,
      "ui:fieldCss": fullWidthCss,
    },
    mainlineTimeInQueueFactor: {
      "ui:description": boundsDescription,
    },
    numDependentsFactor: {
      "ui:description": boundsDescription,
    },
    patchFactor: {
      "ui:description": boundsDescription,
    },
    patchTimeInQueueFactor: {
      "ui:description": boundsDescription,
    },
    stepbackTaskFactor: {
      "ui:description": boundsDescription,
    },
    taskFinder: {
      "ui:allowDeselect": false,
      "ui:fieldCss": fullWidthCss,
    },
    translateProjectCacheBytesLimit: {
      "ui:description":
        "Byte budget for the project translation cache, measured against each entry's serialized size. 0 uses the built-in default.",
    },
    translateProjectCacheTTLSeconds: {
      "ui:description":
        "Lifetime of each project translation cache entry, in seconds. 0 uses the built-in default. Changing this rebuilds the cache.",
    },
    translateProjectConcurrencyLimit: {
      "ui:description":
        "Maximum number of project configs translated concurrently. 0 means unlimited.",
    },
  },
};

export const repotracker = {
  schema: {
    maxConcurrentRequests: {
      title: "Max Concurrent Requests",
      type: "number" as const,
    },
    maxRepoRevisionsToSearch: {
      title: "Max Revisions to Search",
      type: "number" as const,
    },
    numNewRepoRevisionsToFetch: {
      title: "New Revisions to Fetch",
      type: "number" as const,
    },
  },
  uiSchema: {},
};
