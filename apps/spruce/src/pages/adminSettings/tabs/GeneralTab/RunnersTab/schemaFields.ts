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
      type: "string" as const,
      title: "SES Email",
      format: "validEmail",
    },
  },
  uiSchema: {},
};

export const taskLimits = {
  schema: {
    maxTasksPerVersion: {
      type: "number" as const,
      title: "Max Tasks Per Version",
    },
    maxIncludesPerVersion: {
      type: "number" as const,
      title: "Max Includes Per Version",
    },
    maxPendingGeneratedTasks: {
      type: "number" as const,
      title: "Max Pending Generated Tasks",
    },
    maxHourlyPatchTasks: {
      type: "number" as const,
      title: "Max Hourly Patch Tasks Per User",
    },
    maxGenerateTaskJSONSize: {
      type: "number" as const,
      title: "Generate Task JSON Limit (MB)",
    },
    maxDegradedModeParserProjectSize: {
      type: "number" as const,
      title: "CPU Degraded Parser Project Limit (MB)",
    },
    maxConcurrentLargeParserProjectTasks: {
      type: "number" as const,
      title: "Max Concurrent Large Parser Project Tasks",
    },
    maxDegradedModeConcurrentLargeParserProjectTasks: {
      type: "number" as const,
      title: "CPU Degraded Concurrent Large Parser Project Tasks",
    },
    maxParserProjectSize: {
      type: "number" as const,
      title: "Max Parser Project Size (MB)",
    },
    maxExecTimeoutSecs: {
      type: "number" as const,
      title: "Max Task Exec Timeout (secs)",
    },
    maxTaskExecution: {
      type: "number" as const,
      title: "Max Task Execution Number (zero based)",
    },
    maxDailyAutomaticRestarts: {
      type: "number" as const,
      title: "Max Daily Automatic Restarts Per Project",
    },
  },
  uiSchema: {},
};

export const hostInit = {
  schema: {
    hostThrottle: {
      type: "number" as const,
      title: "Host Creation Throttle (num hosts)",
    },
    provisioningThrottle: {
      type: "number" as const,
      title: "Host Provisioning Throttle (num hosts)",
    },
    cloudStatusBatchSize: {
      type: "number" as const,
      title: "Cloud Status Batch Size",
    },
    maxTotalDynamicHosts: {
      type: "number" as const,
      title: "Max Total Dynamic Hosts",
    },
  },
  uiSchema: {},
};

export const podLifecycle = {
  schema: {
    maxParallelPodRequests: {
      type: "number" as const,
      title: "Max Parallel Pod Requests",
    },
    maxPodDefinitionCleanupRate: {
      type: "number" as const,
      title: "Max Pod Definition Cleanup (Per Job)",
    },
    maxSecretCleanupRate: {
      type: "number" as const,
      title: "Max Secret Cleanup (Per Job)",
    },
  },
  uiSchema: {},
};

const boundsDescription = "Value should range from 0 to 100 inclusive.";
const finderOptions = [
  {
    type: "string" as const,
    title: "Legacy",
    enum: [FinderVersion.Legacy],
  },
  {
    type: "string" as const,
    title: "Parallel",
    enum: [FinderVersion.Parallel],
  },
  {
    type: "string" as const,
    title: "Alternate",
    enum: [FinderVersion.Alternate],
  },
  {
    type: "string" as const,
    title: "Pipeline",
    enum: [FinderVersion.Pipeline],
  },
];
const hostAllocatorOptions = [
  {
    type: "string" as const,
    title: "Utilization",
    enum: [HostAllocatorVersion.Utilization],
  },
];
const roundingOptions = [
  {
    type: "string" as const,
    title: "Round down",
    enum: [RoundingRule.Down],
  },
  {
    type: "string" as const,
    title: "Round up",
    enum: [RoundingRule.Up],
  },
];

const feedbackOptions = [
  {
    type: "string" as const,
    title: "No feedback",
    enum: [FeedbackRule.NoFeedback],
  },
  {
    type: "string" as const,
    title: "Wait over threshold",
    enum: [FeedbackRule.WaitsOverThresh],
  },
];

const overallocatedOptions = [
  {
    type: "string" as const,
    title: "No terminations when overallocated",
    enum: [OverallocatedRule.Ignore],
  },
  {
    type: "string" as const,
    title: "Terminate hosts when overallocated",
    enum: [OverallocatedRule.Terminate],
  },
];

export const scheduler = {
  schema: {
    taskFinder: {
      type: "string" as const,
      title: "Task Finder",
      oneOf: finderOptions,
    },
    hostAllocator: {
      type: "string" as const,
      title: "Host Allocator",
      oneOf: hostAllocatorOptions,
    },
    hostAllocatorRoundingRule: {
      type: "string" as const,
      title: "Rounding Rule",
      oneOf: roundingOptions,
    },
    hostAllocatorFeedbackRule: {
      type: "string" as const,
      title: "Feedback Rule",
      oneOf: feedbackOptions,
    },
    hostsOverallocatedRule: {
      type: "string" as const,
      title: "Overallocation Rule",
      oneOf: overallocatedOptions,
    },
    futureHostFraction: {
      type: "number" as const,
      title: "Default Future Host Fraction",
      minimum: 0,
      maximum: 1,
    },
    cacheDurationSeconds: {
      type: "number" as const,
      title: "Cache Schedules in API (secs)",
    },
    targetTimeSeconds: {
      type: "number" as const,
      title: "Max Secret Cleanup (Per Job)",
    },
    acceptableHostIdleTimeSeconds: {
      type: "number" as const,
      title: "Max Secret Cleanup (Per Job)",
    },
    patchFactor: {
      type: "number" as const,
      title: "Patch Factor",
      default: 0,
      minimum: 0,
      maximum: 100,
    },
    patchTimeInQueueFactor: {
      type: "number" as const,
      title: "Patch Time In Queue Factor",
      default: 0,
      minimum: 0,
      maximum: 100,
    },
    commitQueueFactor: {
      type: "number" as const,
      title: "Commit Queue Factor",
      default: 0,
      minimum: 0,
      maximum: 100,
    },
    mainlineTimeInQueueFactor: {
      type: "number" as const,
      title: "Mainline Time In Queue Factor",
      default: 0,
      minimum: 0,
      maximum: 100,
    },
    expectedRuntimeFactor: {
      type: "number" as const,
      title: "Expected Runtime Factor",
      default: 0,
      minimum: 0,
      maximum: 100,
    },
    generateTaskFactor: {
      type: "number" as const,
      title: "Generate Task Factor",
      default: 0,
      minimum: 0,
      maximum: 100,
    },
    stepbackTaskFactor: {
      type: "number" as const,
      title: "Stepback Task Factor",
      default: 0,
      minimum: 0,
      maximum: 100,
    },
    numDependentsFactor: {
      type: "number" as const,
      title: "Num Dependents Factor",
      default: 0,
      minimum: 0,
      maximum: 100,
    },
    groupVersions: {
      type: "boolean" as const,
      title: "Group Versions",
    },
  },
  uiSchema: {
    taskFinder: {
      "ui:allowDeselect": false,
      "ui:fieldCss": fullWidthCss,
    },
    hostAllocator: {
      "ui:allowDeselect": false,
      "ui:fieldCss": fullWidthCss,
    },
    hostAllocatorRoundingRule: {
      "ui:allowDeselect": false,
      "ui:fieldCss": fullWidthCss,
    },
    hostAllocatorFeedbackRule: {
      "ui:allowDeselect": false,
      "ui:fieldCss": fullWidthCss,
    },
    hostsOverallocatedRule: {
      "ui:allowDeselect": false,
      "ui:fieldCss": fullWidthCss,
    },
    patchFactor: {
      "ui:description": boundsDescription,
    },
    patchTimeInQueueFactor: {
      "ui:description": boundsDescription,
    },
    commitQueueFactor: {
      "ui:description": boundsDescription,
    },
    mainlineTimeInQueueFactor: {
      "ui:description": boundsDescription,
    },
    expectedRuntimeFactor: {
      "ui:description": boundsDescription,
    },
    generateTaskFactor: {
      "ui:description": boundsDescription,
    },
    stepbackTaskFactor: {
      "ui:description": boundsDescription,
    },
    numDependentsFactor: {
      "ui:description": boundsDescription,
    },
    groupVersions: {
      "ui:fieldCss": fullWidthCss,
      "ui:description":
        "Groups tasks by their version ID in the underlying planning queue.",
    },
  },
};

export const repotracker = {
  schema: {
    numNewRepoRevisionsToFetch: {
      type: "number" as const,
      title: "New Revisions to Fetch",
    },
    maxRepoRevisionsToSearch: {
      type: "number" as const,
      title: "Max Revisions to Search",
    },
    maxConcurrentRequests: {
      type: "number" as const,
      title: "Max Concurrent Requests",
    },
  },
  uiSchema: {},
};
