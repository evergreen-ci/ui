import {
  FinderVersion,
  FeedbackRule,
  HostAllocatorVersion,
  OverallocatedRule,
  RoundingRule,
} from "gql/generated/types";

export interface RunnersFormState {
  runners: {
    notify: {
      sesEmail: string;
    };
    taskLimits: {
      maxTasksPerVersion: number;
      maxIncludesPerVersion: number;
      maxHourlyPatchTasks: number;
      maxPendingGeneratedTasks: number;
      maxGenerateTaskJSONSize: number;
      maxConcurrentLargeParserProjectTasks: number;
      maxDegradedModeConcurrentLargeParserProjectTasks: number;
      maxDegradedModeParserProjectSize: number;
      maxParserProjectSize: number;
      maxExecTimeoutSecs: number;
      maxTaskExecution: number;
      maxDailyAutomaticRestarts: number;
    };
    hostInit: {
      hostThrottle: number;
      provisioningThrottle: number;
      cloudStatusBatchSize: number;
      maxTotalDynamicHosts: number;
    };
    podLifecycle: {
      maxParallelPodRequests: number;
      maxPodDefinitionCleanupRate: number;
      maxSecretCleanupRate: number;
    };
    scheduler: {
      taskFinder: FinderVersion;
      hostAllocator: HostAllocatorVersion;
      hostAllocatorRoundingRule: RoundingRule;
      hostAllocatorFeedbackRule: FeedbackRule;
      hostsOverallocatedRule: OverallocatedRule;
      futureHostFraction: number;
      cacheDurationSeconds: number;
      targetTimeSeconds: number;
      acceptableHostIdleTimeSeconds: number;
      patchFactor: number;
      patchTimeInQueueFactor: number;
      commitQueueFactor: number;
      mainlineTimeInQueueFactor: number;
      expectedRuntimeFactor: number;
      generateTaskFactor: number;
      stepbackTaskFactor: number;
      numDependentsFactor: number;
      groupVersions: boolean;
    };
    repotracker: {
      numNewRepoRevisionsToFetch: number;
      maxRepoRevisionsToSearch: number;
      maxConcurrentRequests: number;
    };
  };
}

export type TabProps = {
  runnersData: RunnersFormState;
};
