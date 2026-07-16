import {
  FinderVersion,
  AdminSettingsInput,
  HostAllocatorVersion,
  RoundingRule,
  OverallocatedRule,
  FeedbackRule,
} from "gql/generated/types";
import { adminSettings } from "../../testData";
import { formToGql, gqlToForm } from "./transformers";
import { RunnersFormState } from "./types";

describe("runners section", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(adminSettings)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form, adminSettings)).toStrictEqual(gql);
  });
});

const form: RunnersFormState = {
  runners: {
    hostInit: {
      cloudStatusBatchSize: 1,
      hostThrottle: 1,
      maxTotalDynamicHosts: 1,
      provisioningThrottle: 1,
    },
    notify: {
      sesEmail: "evg-sender",
    },
    repotracker: {
      maxConcurrentRequests: 1,
      maxRepoRevisionsToSearch: 1,
      numNewRepoRevisionsToFetch: 1,
    },
    scheduler: {
      acceptableHostIdleTimeSeconds: 1,
      cacheDurationSeconds: 1,
      commitQueueFactor: 1,
      expectedRuntimeFactor: 1,
      futureHostFraction: 1,
      generateTaskFactor: 1,
      groupVersions: false,
      hostAllocator: HostAllocatorVersion.Utilization,
      hostAllocatorFeedbackRule: FeedbackRule.NoFeedback,
      hostAllocatorRoundingRule: RoundingRule.Up,
      hostsOverallocatedRule: OverallocatedRule.Ignore,
      mainlineTimeInQueueFactor: 1,
      numDependentsFactor: 1,
      patchFactor: 1,
      patchTimeInQueueFactor: 1,
      stepbackTaskFactor: 1,
      targetTimeSeconds: 1,
      taskFinder: FinderVersion.Parallel,
      translateProjectCacheBytesLimit: 1,
      translateProjectCacheTTLSeconds: 1,
      translateProjectConcurrencyLimit: 1,
    },
    taskLimits: {
      maxConcurrentLargeParserProjectTasks: 1,
      maxDailyAutomaticRestarts: 1,
      maxDegradedModeConcurrentLargeParserProjectTasks: 1,
      maxDegradedModeParserProjectSize: 1,
      maxExecTimeoutSecs: 1,
      maxGenerateTaskJSONSize: 1,
      maxHourlyPatchTasks: 1,
      maxIncludesPerVersion: 1,
      maxParserProjectSize: 1,
      maxPendingGeneratedTasks: 1,
      maxScheduledTasksPerDistro: 1,
      maxTaskExecution: 1,
      maxTasksPerVersion: 1,
    },
  },
};

const gql: AdminSettingsInput = {
  hostInit: {
    cloudStatusBatchSize: 1,
    hostThrottle: 1,
    maxTotalDynamicHosts: 1,
    provisioningThrottle: 1,
  },
  notify: {
    bufferIntervalSeconds: 1,
    bufferTargetPerInterval: 1,
    ses: {
      senderAddress: "evg-sender",
    },
  },
  repotracker: {
    maxConcurrentRequests: 1,
    maxRepoRevisionsToSearch: 1,
    numNewRepoRevisionsToFetch: 1,
  },
  scheduler: {
    acceptableHostIdleTimeSeconds: 1,
    cacheDurationSeconds: 1,
    commitQueueFactor: 1,
    expectedRuntimeFactor: 1,
    futureHostFraction: 1,
    generateTaskFactor: 1,
    groupVersions: false,
    hostAllocator: HostAllocatorVersion.Utilization,
    hostAllocatorFeedbackRule: FeedbackRule.NoFeedback,
    hostAllocatorRoundingRule: RoundingRule.Up,
    hostsOverallocatedRule: OverallocatedRule.Ignore,
    mainlineTimeInQueueFactor: 1,
    numDependentsFactor: 1,
    patchFactor: 1,
    patchTimeInQueueFactor: 1,
    stepbackTaskFactor: 1,
    targetTimeSeconds: 1,
    taskFinder: FinderVersion.Parallel,
    translateProjectCacheBytesLimit: 1,
    translateProjectCacheTTLSeconds: 1,
    translateProjectConcurrencyLimit: 1,
  },
  taskLimits: {
    maxConcurrentLargeParserProjectTasks: 1,
    maxDailyAutomaticRestarts: 1,
    maxDegradedModeConcurrentLargeParserProjectTasks: 1,
    maxDegradedModeParserProjectSize: 1,
    maxExecTimeoutSecs: 1,
    maxGenerateTaskJSONSize: 1,
    maxHourlyPatchTasks: 1,
    maxIncludesPerVersion: 1,
    maxParserProjectSize: 1,
    maxPendingGeneratedTasks: 1,
    maxScheduledTasksPerDistro: 1,
    maxTaskExecution: 1,
    maxTasksPerVersion: 1,
  },
};
