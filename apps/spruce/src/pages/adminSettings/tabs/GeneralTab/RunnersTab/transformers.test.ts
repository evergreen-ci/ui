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
    expect(formToGql(form)).toStrictEqual(gql);
  });
});

const form: RunnersFormState = {
  runners: {
    notify: {
      sesEmail: "evg-sender",
    },
    taskLimits: {
      maxTasksPerVersion: 1,
      maxIncludesPerVersion: 1,
      maxHourlyPatchTasks: 1,
      maxPendingGeneratedTasks: 1,
      maxGenerateTaskJSONSize: 1,
      maxConcurrentLargeParserProjectTasks: 1,
      maxDegradedModeConcurrentLargeParserProjectTasks: 1,
      maxDegradedModeParserProjectSize: 1,
      maxParserProjectSize: 1,
      maxExecTimeoutSecs: 1,
      maxTaskExecution: 1,
      maxDailyAutomaticRestarts: 1,
    },
    hostInit: {
      hostThrottle: 1,
      provisioningThrottle: 1,
      cloudStatusBatchSize: 1,
      maxTotalDynamicHosts: 1,
    },
    podLifecycle: {
      maxParallelPodRequests: 1,
      maxPodDefinitionCleanupRate: 1,
      maxSecretCleanupRate: 1,
    },
    scheduler: {
      taskFinder: FinderVersion.Parallel,
      hostAllocator: HostAllocatorVersion.Utilization,
      hostAllocatorRoundingRule: RoundingRule.Up,
      hostAllocatorFeedbackRule: FeedbackRule.NoFeedback,
      hostsOverallocatedRule: OverallocatedRule.Ignore,
      futureHostFraction: 1,
      cacheDurationSeconds: 1,
      targetTimeSeconds: 1,
      acceptableHostIdleTimeSeconds: 1,
      groupVersions: false,
      patchFactor: 1,
      patchTimeInQueueFactor: 1,
      commitQueueFactor: 1,
      mainlineTimeInQueueFactor: 1,
      expectedRuntimeFactor: 1,
      generateTaskFactor: 1,
      numDependentsFactor: 1,
      stepbackTaskFactor: 1,
    },
    repotracker: {
      numNewRepoRevisionsToFetch: 1,
      maxRepoRevisionsToSearch: 1,
      maxConcurrentRequests: 1,
    },
  },
};

const gql: AdminSettingsInput = {
  notify: {
    ses: {
      senderAddress: "evg-sender",
    },
  },
  taskLimits: {
    maxTasksPerVersion: 1,
    maxIncludesPerVersion: 1,
    maxHourlyPatchTasks: 1,
    maxPendingGeneratedTasks: 1,
    maxGenerateTaskJSONSize: 1,
    maxConcurrentLargeParserProjectTasks: 1,
    maxDegradedModeConcurrentLargeParserProjectTasks: 1,
    maxDegradedModeParserProjectSize: 1,
    maxParserProjectSize: 1,
    maxExecTimeoutSecs: 1,
    maxTaskExecution: 1,
    maxDailyAutomaticRestarts: 1,
  },
  hostInit: {
    hostThrottle: 1,
    provisioningThrottle: 1,
    cloudStatusBatchSize: 1,
    maxTotalDynamicHosts: 1,
  },
  podLifecycle: {
    maxParallelPodRequests: 1,
    maxPodDefinitionCleanupRate: 1,
    maxSecretCleanupRate: 1,
  },
  scheduler: {
    taskFinder: FinderVersion.Parallel,
    hostAllocator: HostAllocatorVersion.Utilization,
    hostAllocatorRoundingRule: RoundingRule.Up,
    hostAllocatorFeedbackRule: FeedbackRule.NoFeedback,
    hostsOverallocatedRule: OverallocatedRule.Ignore,
    futureHostFraction: 1,
    cacheDurationSeconds: 1,
    targetTimeSeconds: 1,
    acceptableHostIdleTimeSeconds: 1,
    groupVersions: false,
    patchFactor: 1,
    patchTimeInQueueFactor: 1,
    commitQueueFactor: 1,
    mainlineTimeInQueueFactor: 1,
    expectedRuntimeFactor: 1,
    generateTaskFactor: 1,
    numDependentsFactor: 1,
    stepbackTaskFactor: 1,
  },
  repotracker: {
    numNewRepoRevisionsToFetch: 1,
    maxRepoRevisionsToSearch: 1,
    maxConcurrentRequests: 1,
  },
};
